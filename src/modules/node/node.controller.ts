import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  @Auth([Role.ADMIN])
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Get()
  @Auth([Role.ADMIN])
  findAll() {
    return this.nodeService.findAll();
  }

  @Get(':nodeId')
  @Auth([Role.ADMIN])
  findOne(@Param('nodeId') nodeId: string) {
    return this.nodeService.findOne(nodeId);
  }

  @Patch(':nodeId')
  @Auth([Role.ADMIN])
  update(
    @Param('nodeId') nodeId: string,
    @Body() updateNodeDto: UpdateNodeDto,
  ) {
    return this.nodeService.update(nodeId, updateNodeDto);
  }

  @Delete(':nodeId')
  @Auth([Role.ADMIN])
  remove(@Param('nodeId') nodeId: string) {
    return this.nodeService.remove(nodeId);
  }
}
