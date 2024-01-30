import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.respone';
import { Kategori } from './kategori.entity';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  createKategoriArrayDto,
  findAllKategori,
} from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from '../auth/auth.entity';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(REQUEST) private req: any, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save(payload); // cukup payload tanpa manipulasi object

      return this._success('OK', this.req.user.user_id);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async update(
    id: number,
    payload: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const kategori = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
    });
    if (kategori === null) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const update = await this.kategoriRepository.save({ ...payload, id: id });

    return this._success('OK', this.req.user.user_id);
  }

  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori, nama_user } = query;
    console.log('query', query);
    const filterQuery: { [key: string]: any } = {};

    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    if (nama_user) {
      filterQuery.created_by = {
        nama: Like(`%${nama_user}%`),
      };
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }
  async getUserCategory(): Promise<ResponseSuccess> {
    const user = await this.userRepository.findOne({
      where: {
        id: this.req.user.id,
      },
      relations: ['kategori_created_by', 'kategori_updated_by'],

      select: {
        id: true,
        nama: true,
        kategori_created_by: {
          id: true,
          nama_kategori: true,
        },
      },
    });
    return this._success('ok', user);
  }

  async bulkCreate(payload: createKategoriArrayDto): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);

      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.kategoriRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menambahkan kategori sebanyak ${berhasil} dan gagal sebanyak ${gagal} `,
        data: payload,
      };
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async deletekategori(id: number): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check)
      throw new NotFoundException(`kategori dengan id ${id} tidak ditemukan`);
    await this.kategoriRepository.delete(id);
    return {
      status: 'ok',
      message: 'berhasil',
      data: this.kategoriRepository,
    };
  }
}
