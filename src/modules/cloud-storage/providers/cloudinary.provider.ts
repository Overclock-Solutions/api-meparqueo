import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import {
  FileInfo,
  StorageProvider,
} from '../interfaces/storage-provider.interface';

@Injectable()
export class CloudinaryProvider implements StorageProvider {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async upload(file: Express.Multer.File, path = 'uploads'): Promise<FileInfo> {
    // Convertir el buffer del archivo a base64 para Cloudinary
    const base64 = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const fileNameWithoutExt = file.originalname.split('.')[0];
    const timestamp = Date.now();
    const publicId = `${path}/${timestamp}-${fileNameWithoutExt}`;

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: path,
          resource_type: 'auto',
          public_id: publicId,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });

    return {
      id: result.public_id,
      key: result.public_id,
      url: result.secure_url,
      name: file.originalname,
      size: result.bytes,
      mimeType: file.mimetype,
      metadata: {
        width: result.width,
        height: result.height,
        format: result.format,
      },
    };
  }

  async delete(fileId: string): Promise<boolean> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.destroy(fileId, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });

      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      return false;
    }
  }

  async getUrl(fileId: string): Promise<string> {
    // En Cloudinary, podemos construir la URL directamente o consultar los detalles
    return cloudinary.url(fileId);
  }

  async getFileInfo(fileId: string): Promise<FileInfo> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.api.resource(fileId, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });

      return {
        id: result.public_id,
        key: result.public_id,
        url: result.secure_url,
        name: result.public_id.split('/').pop(),
        size: result.bytes,
        mimeType: result.resource_type + '/' + result.format,
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error(`File with id ${fileId} not found`);
    }
  }
}
