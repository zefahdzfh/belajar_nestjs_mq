import { OmitType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  Length,
  isNumber,
  IsArray,
  ValidateNested,
  IsIn,
  IsOptional,
} from 'class-validator';

const hondaTipeMobil = ['crv', 'brv', 'hrv'];
const toyotaTipeMobil = ['avanza', 'inova', 'raize'];
const suzukiTipeMobil = ['ertiga', 'xl7', 'baleno'];
const tahunMin = 2017;
const tahunMax = 2023;
const hargaMin = 150000000;
const hargaMax = 400000000;

export class PtsDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  @IsIn(['honda', 'toyota', 'suzuki'])
  merek: string;

  @IsNotEmpty()
  @IsIn([...hondaTipeMobil, ...toyotaTipeMobil, ...suzukiTipeMobil])
  tipe: string;

  @IsNotEmpty()
  @IsInt()
  @Min(tahunMin)
  @Max(tahunMax)
  tahun: number;

  @IsNotEmpty()
  @IsInt()
  @Min(hargaMin)
  @Max(hargaMax)
  harga: number;
}

export class CreateMobilDto {
  nama: string;
  merek: string;
  tipe: string;
  harga: number;
  tahun: number;
}

export class CreateMobilArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateMobilDto)
  data: CreateMobilDto[];
}

export class CreateBulkMobilDto {
  data: CreateMobilDto[]; // An array of objects conforming to CreateMobilDto
}
