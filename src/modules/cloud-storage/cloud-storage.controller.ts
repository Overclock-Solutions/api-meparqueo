import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudStorageService } from './cloud-storage.service';
import { DeleteFileDto, GetFileDto, UploadFileDto } from './dto/file.dto';
import { FileInfo } from './interfaces/storage-provider.interface';

@Controller('files')
export class CloudStorageController {
  constructor(private readonly cloudStorageService: CloudStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() uploadFileDto: UploadFileDto,
  ): Promise<FileInfo> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.cloudStorageService.uploadFile(file, uploadFileDto.path);
  }

  @Delete(':fileId')
  async deleteFile(
    @Param() params: DeleteFileDto,
  ): Promise<{ success: boolean }> {
    const success = await this.cloudStorageService.deleteFile(params.fileId);
    return { success };
  }

  @Get(':fileId/url')
  async getFileUrl(@Param() params: GetFileDto): Promise<{ url: string }> {
    const url = await this.cloudStorageService.getFileUrl(params.fileId);
    return { url };
  }

  @Get(':fileId')
  async getFileInfo(@Param() params: GetFileDto): Promise<FileInfo> {
    return this.cloudStorageService.getFileInfo(params.fileId);
  }
}
