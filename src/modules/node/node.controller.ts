import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';
import {
  ApiTags,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  RESPONSE_CONFLICT_NODE_409,
  RESPONSE_CONFLICT_UPDATE_NODE,
  RESPONSE_CREATE_NODE_201,
  RESPONSE_DELETE_NODE,
  RESPONSE_FIND_ALL_NODES,
  RESPONSE_FIND_ONE_NODE,
  RESPONSE_NOT_FOUND_NODE,
  RESPONSE_UPDATE_NODE,
} from './docs/responses';
import {
  RESPONSE_FORBIDDEN_403,
  RESPONSE_UNAUTHORIZED_401,
} from '../common/docs/responses';

@ApiTags('Nodos')
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token',
})
@ApiResponse({
  status: 401,
  description: 'No autorizado',
  example: RESPONSE_UNAUTHORIZED_401,
})
@ApiResponse({
  status: 403,
  description: 'Prohibido',
  example: RESPONSE_FORBIDDEN_403,
})
@ApiExtraModels(CreateNodeDto, UpdateNodeDto)
@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Registrar nuevo nodo (admin)' })
  @ApiBody({ type: CreateNodeDto })
  @ApiResponse({ status: 201, example: RESPONSE_CREATE_NODE_201 })
  @ApiResponse({ status: 409, example: RESPONSE_CONFLICT_NODE_409 })
  @ResponseMessage('Nodo creado correctamente')
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Get()
  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Obtener todos los nodos (admin)' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ALL_NODES })
  @ResponseMessage('Nodos encontrados correctamente')
  findAll() {
    return this.nodeService.findAll();
  }

  @Get(':nodeId')
  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Obtener nodo por ID (admin)' })
  @ApiResponse({ status: 200, example: RESPONSE_FIND_ONE_NODE })
  @ApiResponse({ status: 404, example: RESPONSE_NOT_FOUND_NODE })
  @ResponseMessage('Nodo encontrado correctamente')
  findOne(@Param('nodeId') nodeId: string) {
    return this.nodeService.findOne(nodeId);
  }

  @Put(':nodeId')
  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Actualizar nodo por ID (admin)' })
  @ApiBody({ type: CreateNodeDto })
  @ApiResponse({ status: 200, example: RESPONSE_UPDATE_NODE })
  @ApiResponse({ status: 404, example: RESPONSE_NOT_FOUND_NODE })
  @ApiResponse({ status: 409, example: RESPONSE_CONFLICT_UPDATE_NODE })
  @ResponseMessage('Nodo actualizado correctamente')
  update(
    @Param('nodeId') nodeId: string,
    @Body() updateNodeDto: UpdateNodeDto,
  ) {
    return this.nodeService.update(nodeId, updateNodeDto);
  }

  @Delete(':nodeId')
  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Eliminar nodo por ID (admin)' })
  @ApiResponse({ status: 200, example: RESPONSE_DELETE_NODE })
  @ApiResponse({ status: 404, example: RESPONSE_NOT_FOUND_NODE })
  @ResponseMessage('Nodo eliminado correctamente')
  remove(@Param('nodeId') nodeId: string) {
    return this.nodeService.remove(nodeId);
  }
}
