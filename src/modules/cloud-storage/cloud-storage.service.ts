import { Inject, Injectable } from '@nestjs/common';
import {
  FileInfo,
  StorageProvider,
} from './interfaces/storage-provider.interface';

@Injectable()
export class CloudStorageService {
  constructor(
    @Inject('STORAGE_PROVIDER')
    private readonly storageProvider: StorageProvider,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    path?: string,
  ): Promise<FileInfo> {
    return this.storageProvider.upload(file, path);
  }

  async deleteFile(fileId: string): Promise<boolean> {
    return this.storageProvider.delete(fileId);
  }

  async getFileUrl(fileId: string): Promise<string> {
    return this.storageProvider.getUrl(fileId);
  }

  async getFileInfo(fileId: string): Promise<FileInfo> {
    return this.storageProvider.getFileInfo(fileId);
  }
}
