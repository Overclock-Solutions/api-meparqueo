export interface FileInfo {
  id: string;
  url: string;
  key?: string;
  name: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
}

export interface StorageProvider {
  upload(file: Express.Multer.File, path?: string): Promise<FileInfo>;
  delete(fileId: string): Promise<boolean>;
  getUrl(fileId: string): Promise<string>;
  getFileInfo(fileId: string): Promise<FileInfo>;
}
