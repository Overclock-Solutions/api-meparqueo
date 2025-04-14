import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import * as dayjs from 'dayjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: string[] = [];
    const standardMessage = 'Algo salió mal.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();

      if (typeof responseMessage === 'object' && responseMessage['message']) {
        errors = Array.isArray(responseMessage['message'])
          ? responseMessage['message']
          : [responseMessage['message']];
      } else if (typeof responseMessage === 'string') {
        errors = [responseMessage];
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000':
          status = HttpStatus.BAD_REQUEST;
          errors = [
            'El valor proporcionado es demasiado largo para el campo correspondiente.',
          ];
          break;
        case 'P2001':
          status = HttpStatus.NOT_FOUND;
          errors = ['No se encontró el registro solicitado.'];
          break;
        case 'P2002':
          status = HttpStatus.CONFLICT;
          const target = exception.meta?.target;
          errors = [
            `Violación de restricción única en el campo ${target}. El registro ya existe.`,
          ];
          break;
        case 'P2003':
          status = HttpStatus.CONFLICT;
          errors = ['Fallo en la restricción de clave foránea.'];
          break;
        case 'P2004':
          status = HttpStatus.BAD_REQUEST;
          errors = ['Fallo en una restricción de la base de datos.'];
          break;
        case 'P2005':
          status = HttpStatus.BAD_REQUEST;
          errors = ['El valor proporcionado para el campo no es válido.'];
          break;
        case 'P2006':
          status = HttpStatus.BAD_REQUEST;
          errors = ['Falta un campo requerido.'];
          break;
        case 'P2007':
          status = HttpStatus.BAD_REQUEST;
          errors = ['Error de validación del campo.'];
          break;
        case 'P2018': {
          const details = exception.meta?.details;
          status = HttpStatus.BAD_REQUEST;
          errors = [
            `No se encontraron los registros requeridos para la conexión. ${details ? details : ''}`.trim(),
          ];
          break;
        }
        case 'P2025': {
          const cause = exception.meta?.cause;
          status = HttpStatus.CONFLICT;
          errors = [
            `La operación falló porque depende de uno o más registros requeridos que no se encontraron. ${cause ? cause : ''}`.trim(),
          ];
          break;
        }
        default:
          errors = [exception.message];
      }
    } else if (exception instanceof PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      const cleanMessage = exception.message.replace(/\u001b\[[0-9;]*m/g, '');
      let friendlyMessage =
        'La consulta enviada es inválida. Por favor, verifique la estructura y los argumentos proporcionados.';
      if (cleanMessage.includes('Unknown argument')) {
        friendlyMessage =
          'Se ha proporcionado un argumento desconocido. Verifique que los nombres de los campos sean correctos.';
      } else if (cleanMessage.includes('Invalid')) {
        friendlyMessage =
          'Se ha detectado un error en la validación de los datos enviados. Revise los datos e intente nuevamente.';
      }
      errors = [friendlyMessage];
    } else if (exception instanceof Error) {
      errors = [exception.message];
    } else {
      errors = ['Ocurrió un error inesperado.'];
    }

    if (errors.length === 0) {
      errors = [standardMessage];
    }

    response.status(status).json({
      statusCode: status,
      timestamp: dayjs().toISOString(),
      success: false,
      message: standardMessage,
      errors,
    });
  }
}
