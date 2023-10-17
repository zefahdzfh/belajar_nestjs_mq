import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseSuccess } from 'src/interface/response.interface';
import { UserDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  private users: {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status: string;
  }[] = [
    {
      id: 1,
      nama: 'zefa',
      email: 'zefa@gmail.com',
      umur: 16,
      tanggal_lahir: '19 juni 2007',
      status: 'pelajar',
    },
  ];

  getAllUser(): ResponseSuccess {
    return {
      status: 'Success',
      message: 'List User ditermukan',
      data: this.users,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<ResponseSuccess> {
    const { nama, email, umur, tanggal_lahir, status } = createUserDto;

    try {
      await this.userRepository.save({
        nama: nama,
        email: email,
        umur: umur,
        tanggal_lahir: tanggal_lahir,
        status: status,
      });
      return {
        status: 'Success',
        message: 'Berhasil menambakan User',
      };
    } catch (err) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  getDetail(id: number): {
    id: number;
    nama: string;
    email: string;
    umur: number;
    tanggal_lahir: string;
    status?: string;
  } {
    const userIndex = this.findUserById(id);
    const user = this.users[userIndex];

    return user;
  }

  updateUser(id: number, payload: any): ResponseSuccess {
    const { nama, email, umur, tanggal_lahir, status } = payload;
    const userIndex = this.findUserById(id);
    this.users[userIndex].nama = nama;
    this.users[userIndex].email = email;
    this.users[userIndex].umur = umur;
    this.users[userIndex].tanggal_lahir = tanggal_lahir;
    this.users[userIndex].status = status;
    return {
      status: 'ok',
      message: 'Berhasil memperbaharui user',
    };
  }

  deleteUser(id: number): { status: string; message: string } {
    const userIndex = this.findUserById(id);
    this.users.splice(userIndex, 1);
    return {
      status: 'ok',
      message: 'Berhasil menghapus user',
    };
  }

  private findUserById(id: number) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`Users dengan ${id} tidak ditemukan`);
    }

    return userIndex;
  }
}
