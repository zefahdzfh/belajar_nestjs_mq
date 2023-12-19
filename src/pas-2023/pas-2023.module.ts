import { Module } from '@nestjs/common';
import { Pas2023Controller } from './pas-2023.controller';
import { Pas2023Service } from './pas-2023.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produk } from './pas-2023.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produk])], // import dengan TypeOrm For Feature
  controllers: [Pas2023Controller],
  providers: [Pas2023Service],
})
export class Pas2023Module {}
