/* eslint-disable @typescript-eslint/no-unused-vars */
import { OmitType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { KategoriProduk } from './pas-2023.entity';
import {
  IsNumber,
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  Length,
  isNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  min,
  MIN_LENGTH,
  MinLength,
  IsEnum,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class ProdukDto {
  id?: number;

  @IsNotEmpty({ message: 'Nama produk wajib diisi' })
  @MinLength(5, { message: 'Nama produk minimal 5 karakter' })
  nama_produk: string;

  @IsNotEmpty({ message: 'Kategori produk wajib diisi' })
  @IsEnum(KategoriProduk, { message: 'Kategori produk tidak valid' })
  kategori_produk: KategoriProduk;

  @IsNotEmpty({ message: 'Harga produk wajib diisi' })
  @IsNumber({}, { message: 'Harga produk harus berupa angka' })
  @Min(10000, { message: 'Harga produk minimal 10.000' })
  harga_produk: number;

  @IsNotEmpty({ message: 'Jumlah produk wajib diisi' })
  @IsInt({ message: 'Jumlah produk harus berupa angka bulat' })
  @Min(10, { message: 'Jumlah produk minimal 10' })
  jumlah_produk: number;

  @IsNotEmpty({ message: 'Deskripsi produk wajib diisi' })
  deskripsi_produk: string;

  @IsNotEmpty({ message: 'Tahun pembuatan wajib diisi' })
  @IsInt({ message: 'Tahun pembuatan harus berupa angka bulat' })
  @Min(2010, { message: 'Tahun pembuatan minimal 2010' })
  @Max(2023, { message: 'Tahun pembuatan maksimal 2023' })
  tahun_pembuatan: number;
}

export class CreateProdukDto extends OmitType(ProdukDto, ['id']) {}
export class UpdateProdukDto extends PickType(ProdukDto, [
  'nama_produk',
  'kategori_produk',
  'harga_produk',
  'jumlah_produk',
  'deskripsi_produk',
  'tahun_pembuatan',
]) {}

export class FindProdukDto extends PageRequestDto {
  @IsOptional()
  nama_produk: string;

  @IsOptional()
  @IsEnum(KategoriProduk)
  kategori_produk: KategoriProduk;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_jumlah_produk: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_jumlah_produk: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_harga_produk: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_harga_produk: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  from_tahun_pembuatan: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  to_tahun_pembuatan: number;

  @IsOptional()
  created_date: Date;

  @IsInt()
  @Type(() => Number)
  page = 1;

  @IsInt()
  @Type(() => Number)
  pageSize = 10;

  @IsInt()
  @IsOptional()
  limit;
}

export class CreateProdukArrayDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateProdukDto)
  data: CreateProdukDto[];
}
export class DeleteArrayDto {
  @IsArray()
  delete: number[];
}
