import { OmitType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsNumber,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageRequestDto } from 'src/utils/dto/page.dto';

export class UserDto {
  id: number;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(12)
  umur: number;

  @IsNotEmpty()
  tanggal_lahir: string;

  @IsNotEmpty()
  status: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}

export class UpdateUserDto extends PickType(UserDto, [
  'id',
  'nama',
  'email',
  'umur',
  'tanggal_lahir',
  'status',
]) {}

export class createUserArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  data: CreateUserDto[];
}
