import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class ProdukDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  barcode: string;

  @IsString()
  @IsNotEmpty()
  nama_produk: string;

  @IsNumber()
  @IsNotEmpty()
  kategori_id: number;

  @IsString()
  @IsNotEmpty()
  deskripsi_produk: string;

  @IsNotEmpty()
  @IsNumber()
  harga: number;

  @IsNotEmpty()
  @IsNumber()
  stok: number;

  @IsOptional()
  @IsString()
  foto: string;

  @IsOptional()
  @IsString()
  nama_kategori: string;

  @IsObject()
  @IsOptional()
  created_by: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
}

export class CreateProdukDto extends OmitType(ProdukDto, ['id']) {}
export class CreateProdukArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProdukDto)
  data: CreateProdukDto[];
}
export class findAllProduk extends PageRequestDto {
  @IsString()
  @IsOptional()
  nama_produk: string;

  @IsString()
  @IsOptional()
  deskripsi_produk: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  dari_harga: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sampai_harga: number;

  @IsOptional()
  @IsString()
  nama_kategori: string;

  @IsString()
  @IsOptional()
  keyword: string;
}

export class UpdateProdukDto extends OmitType(ProdukDto, [
  'created_by',
  'id',
]) {}
