import { OmitType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/mapped-types';
import { IsNumber, IsInt, IsNotEmpty, Min, Max, Length } from 'class-validator';

export class UserDto {
  @IsNumber()
  @Max(10)
  id: number;

  @IsNotEmpty()
  @Length(3, 10)
  nama: string;

  @IsNotEmpty()
  email: string;

  @IsInt()
  @Min(12)
  @Max(18)
  umur: number;

  @IsNotEmpty()
  tanggal_lahir: string;
}

export class CreateUserDto extends OmitType(UserDto, ['id']) {}

export class UpdateUserDto extends PickType(UserDto, [
  'id',
  'nama',
  'email',
  'umur',
  'tanggal_lahir',
]) {}
