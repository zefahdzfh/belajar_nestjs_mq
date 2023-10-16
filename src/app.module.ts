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

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LatihanModule,
    BookModule,
    Pts2023Module,
    AuthModule,
  ],
  controllers: [AppController, Pts2023Controller],
  providers: [AppService, Pts2023Service],
})
export class AppModule {}
