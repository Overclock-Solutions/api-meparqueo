import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CloudStorageService } from './cloud-storage.service';
import { DeleteFileDto, GetFileDto, UploadFileDto } from './dto/file.dto';
import { FileInfo } from './interfaces/storage-provider.interface';

@ApiTags('files')
@Controller('files')
export class CloudStorageController {
  constructor(private readonly cloudStorageService: CloudStorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para la carga de archivos',
    type: UploadFileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo subido exitosamente',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<FileInfo> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.cloudStorageService.uploadFile(file, uploadFileDto.path);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Eliminar un archivo' })
  @ApiBody({ type: DeleteFileDto })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado correctamente',
    schema: { example: { success: true } },
  })
  async deleteFile(@Body() body: DeleteFileDto): Promise<{ success: boolean }> {
    const success = await this.cloudStorageService.deleteFile(body.fileId);
    return { success };
  }

  @Post('get-url')
  @ApiOperation({ summary: 'Obtener la URL firmada de un archivo' })
  @ApiBody({ type: GetFileDto })
  @ApiResponse({
    status: 200,
    description: 'URL generada correctamente',
    schema: { example: { url: 'https://example.com/file' } },
  })
  async getFileUrl(@Body() body: GetFileDto): Promise<{ url: string }> {
    const url = await this.cloudStorageService.getFileUrl(body.fileId);
    return { url };
  }

  @Post('get-info')
  @ApiOperation({ summary: 'Obtener información de un archivo' })
  @ApiBody({ type: GetFileDto })
  @ApiResponse({
    status: 200,
    description: 'Información del archivo obtenida',
  })
  async getFileInfo(@Body() body: GetFileDto): Promise<FileInfo> {
    return this.cloudStorageService.getFileInfo(body.fileId);
  }
}
