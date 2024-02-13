import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.respone';
import { Produk } from './produk.entity';
import { Between, Like, Repository } from 'typeorm';
import {
  CreateProdukArrayDto,
  UpdateProdukDto,
  findAllProduk,
} from './produk.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface';

@Injectable()
export class ProdukService extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async createBulk(payload: CreateProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          const dataSave = {
            ...data,
            kategori: {
              id: data.kategori_id,
            },
            created_by: {
              id: this.req.user.id,
            },
          };

          try {
            await this.produkRepository.save(dataSave);

            berhasil += 1;
          } catch (err) {
            console.log('err', err);
            gagal += 1;
          }
        }),
      );

      return this._success(`Berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch (err) {
      console.log('err', err);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: findAllProduk): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      limit,
      nama_produk,
      dari_harga,
      sampai_harga,
      deskripsi_produk,
      keyword,
      nama_kategori,
    } = query;

    const filterQuery: { [key: string]: any } = {};
    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        {
          nama_produk: Like(`%${keyword}%`),
        },
        {
          harga: Like(`%${keyword}%`),
        },
        {
          deskripsi_produk: Like(`%${keyword}%`),
        },
        {
          nama_kategori: Like(`%${keyword}%`),
        },
      );
    } else {
      if (deskripsi_produk) {
        filterQuery.deskripsi_produk = Like(`%${deskripsi_produk}%`);
      }
      if (nama_produk) {
        filterQuery.nama_produk = Like(`%${nama_produk}%`);
      }
      if (dari_harga && sampai_harga) {
        filterQuery.harga = Between(dari_harga, sampai_harga);
      }
      if (dari_harga && !!sampai_harga === false) {
        filterQuery.harga = Between(dari_harga, dari_harga);
      }
      if (nama_kategori) {
        filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
      }
    }

    const total = await this.produkRepository.count({
      where: keyword ? filterKeyword : filterQuery,
    });
    const result = await this.produkRepository.find({
      where: keyword ? filterKeyword : filterQuery,
      relations: ['created_by', 'updated_by', 'kategori'],
      select: {
        id: true,
        nama_produk: true,
        deskripsi_produk: true,
        stok: true,
        harga: true,
        kategori: {
          id: true,
          nama_kategori: true,
        },
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });
    return this._pagination('OK', result, total, page, pageSize);
  }

  async update(id: number, payload: UpdateProdukDto): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });
    if (produk === null) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const update = await this.produkRepository.save({ ...payload, id: id });

    return this._success('OK', this.req.user.user_id);
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });

    if (produk === null) {
      throw new NotFoundException(`Produk Dengan id ${id} tidak ditemukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil',
      data: produk,
    };
  }

  async deleteProduk(id: number): Promise<ResponseSuccess> {
    const check = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check)
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    await this.produkRepository.delete(id);
    return {
      status: 'ok',
      message: 'berhasil',
      data: this.produkRepository,
    };
  }

  async bulkDelete(payload: any): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);

      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.delete.map(async (item) => {
          try {
            const check = await this.produkRepository.findOne({
              where: {
                id: item,
              },
            });
            if (!check)
              throw new NotFoundException(
                `Produk dengan id ${item} tidak ditemukan`,
              );
            await this.produkRepository.delete(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menghapus Produk sebanyak ${berhasil} dan gagal menghapus sebanyak ${gagal} `,
        data: payload,
      };
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
