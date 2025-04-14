import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  FileInfo,
  StorageProvider,
} from '../interfaces/storage-provider.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class AwsS3Provider implements StorageProvider {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.accessKeySecret'),
      },
    });

    this.bucket = this.configService.get<string>('aws.s3.bucket');
  }

  async upload(file: Express.Multer.File, path = 'uploads'): Promise<FileInfo> {
    const key = `${path}/${dayjs().valueOf()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return {
      id: key,
      key: key,
      url: `https://${this.bucket}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`,
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async delete(fileId: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileId,
      });

      await this.s3.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      return false;
    }
  }

  async getUrl(fileId: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileId,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // 1 hora de validez
  }

  async getFileInfo(fileId: string): Promise<FileInfo> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: fileId,
      });

      const metadata = await this.s3.send(command);
      const url = await this.getUrl(fileId);

      return {
        id: fileId,
        key: fileId,
        url,
        name: fileId.split('/').pop(),
        size: metadata.ContentLength,
        mimeType: metadata.ContentType,
        metadata: metadata.Metadata,
      };
    } catch {
      throw new Error(`File with id ${fileId} not found`);
    }
  }
}
