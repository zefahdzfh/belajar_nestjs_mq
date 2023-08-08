import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [LatihanModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
