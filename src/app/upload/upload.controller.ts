import {
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import BaseResponse from 'src/utils/response/base.respone';
import { JwtGuard } from '../auth/auth.guard';
import { ResponseSuccess } from 'src/interface';
import * as fs from 'fs';

@UseGuards(JwtGuard)
@Controller('upload')
export class UploadController extends BaseResponse {
  constructor() {
    super();
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
    }),
  )
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseSuccess> {
    try {
      const url = `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`;
      return this._success('OK', {
        file_url: url,
        file_name: file.filename,
        file_size: file.size,
      });
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, file, cb) => {
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${new Date().getTime()}.${fileExtension}`);
        },
      }),
    }),
  )
  @Post('files')
  async uploadFileMulti(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ResponseSuccess> {
    try {
      const file_response: Array<{
        file_url: string;
        file_name: string;
        file_size: number;
      }> = [];

      files.forEach((file) => {
        const url = `${process.env.BASE_SERVER_URL}/uploads/${file.filename}`;
        file_response.push({
          file_url: url,
          file_name: file.filename,
          file_size: file.size,
        });
      });

      return this._success('OK', {
        file: file_response,
      });
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('file/delete/:filename')
  async DeleteFile(
    @Param('filename') filename: string,
  ): Promise<ResponseSuccess> {
    try {
      const filePath = `public/uploads/${filename}`;
      fs.unlinkSync(filePath);
      return this._success('Berhasil menghapus File');
    } catch (err) {
      throw new HttpException('File not Found', HttpStatus.NOT_FOUND);
    }
  }
}
