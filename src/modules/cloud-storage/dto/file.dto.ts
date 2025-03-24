import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsString()
  path?: string;
}

export class DeleteFileDto {
  @IsNotEmpty()
  @IsString()
  fileId: string;
}

export class GetFileDto {
  @IsNotEmpty()
  @IsString()
  fileId: string;
}
