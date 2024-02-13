import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { Pts2023Service } from './pts-2023/pts-2023.service';
import { Pts2023Controller } from './pts-2023/pts-2023.controller';
import { Pts2023Module } from './pts-2023/pts-2023.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';
import { KategoriModule } from './app/kategori/kategori.module';
import { ProdukModule } from './app/produk/produk.module';
import { UploadController } from './app/upload/upload.controller';
import { join } from 'path';
import { ServeStaticModule, serveStaticProviders } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    LatihanModule,
    BookModule,
    Pts2023Module,
    AuthModule,
    MailModule,
    KategoriModule,
    ProdukModule,
  ],
  controllers: [AppController, Pts2023Controller, UploadController],
  providers: [AppService, Pts2023Service],
})
export class AppModule {}
