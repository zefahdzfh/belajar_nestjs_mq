/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/interface/response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { KategoriProduk, Produk } from './pas-2023.entity';
import { Between, Like, Repository, FindOneOptions } from 'typeorm';
import { async } from 'rxjs';
import BaseResponse from 'src/utils/response/base.respone';
import {
  CreateProdukArrayDto,
  CreateProdukDto,
  DeleteArrayDto,
  FindProdukDto,
  ProdukDto,
  UpdateProdukDto,
} from './pas-2023.dto';

@Injectable()
export class Pas2023Service extends BaseResponse {
  constructor(
    @InjectRepository(Produk)
    private readonly produkRepository: Repository<Produk>,
  ) {
    super();
  }

  private produks: {
    id?: number;
    nama_produk: string;
    kategori_produk: KategoriProduk;
    harga_produk: number;
    jumlah_produk: number;
    deskripsi_produk: string;
    tahun_pembuatan: number;
  }[] = [
    {
      id: 1,
      nama_produk: 'lenovo thinkpad',
      kategori_produk: KategoriProduk.Laptop,
      harga_produk: 10000000,
      jumlah_produk: 100,
      deskripsi_produk: 'Produk laptop terbaru dari lenovo yang amat gacor',
      tahun_pembuatan: 2017,
    },
  ];

  async getAllProducts(query: FindProdukDto): Promise<ResponsePagination> {
    const {
      page,
      pageSize,
      nama_produk,
      kategori_produk,
      from_jumlah_produk,
      to_jumlah_produk,
      from_harga_produk,
      to_harga_produk,
      from_tahun_pembuatan,
      to_tahun_pembuatan,
      created_date,
    } = query;

    const filter: {
      [key: string]: any;
    } = {};

    if (nama_produk) {
      filter.nama_produk = Like(`%${nama_produk}%`);
    }

    if (kategori_produk) {
      filter.kategori_produk = kategori_produk;
    }

    // Tambahkan filter lainnya sesuai kebutuhan
    if (from_jumlah_produk !== undefined) {
      filter.jumlah_produk = Between(from_jumlah_produk, to_jumlah_produk);
    }

    if (from_harga_produk !== undefined) {
      filter.harga_produk = Between(from_harga_produk, to_harga_produk);
    }

    if (from_tahun_pembuatan !== undefined) {
      filter.tahun_pembuatan = Between(
        from_tahun_pembuatan,
        to_tahun_pembuatan,
      );
    }

    if (created_date !== undefined) {
      filter.created_date = created_date;
    }
    const total = await this.produkRepository.count({
      where: filter,
    });

    const products = await this.produkRepository.find({
      where: filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return this._pagination(
      'Semua produk telah berhasil ditemukan',
      products,
      total,
      page,
      pageSize,
    );
  }

  getAllProduk(): {
    id?: number;
    nama_produk: string;
    kategori_produk: KategoriProduk;
    harga_produk: number;
    jumlah_produk: number;
    deskripsi_produk: string;
    tahun_pembuatan: number;
  }[] {
    return this.produks;
  }

  async createProduk(
    createProdukDto: CreateProdukDto,
  ): Promise<ResponseSuccess> {
    const {
      nama_produk,
      kategori_produk,
      harga_produk,
      jumlah_produk,
      deskripsi_produk,
      tahun_pembuatan,
    } = createProdukDto;

    // Pastikan kategori_produk sesuai dengan tipe enum yang ada di entity Produk
    const newProduk = this.produkRepository.create({
      nama_produk,
      kategori_produk, // ini sudah sesuai
      harga_produk,
      jumlah_produk,
      deskripsi_produk,
      tahun_pembuatan,
    });

    await this.produkRepository.save(newProduk);

    return {
      status: 'Success',
      message: 'Berhasil menambahkan produk',
    };
  }

  async updateProduk(
    id: number,
    payload: UpdateProdukDto,
  ): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!produk) {
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    }

    const updatedProduk = await this.produkRepository.save({
      ...produk,
      ...payload,
    });

    return {
      status: 'ok',
      message: 'Berhasil memperbaharui produk',
      data: updatedProduk,
    };
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!produk) {
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    }

    return {
      status: 'ok',
      message: 'Berhasil Ditemukan',
      data: produk,
    };
  }

  async deleteProduk(id: number): Promise<ResponseSuccess> {
    const produk = await this.produkRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!produk) {
      throw new NotFoundException(`Produk dengan id ${id} tidak ditemukan`);
    }

    await this.produkRepository.delete(id);

    return {
      status: 'ok',
      message: 'Berhasil menghapus produk',
      data: produk,
    };
  }

  async bulkCreate(payload: CreateProdukArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.data.map(async (data) => {
          try {
            await this.produkRepository.save(data);
            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );

      return {
        status: 'ok',
        message: `Berhasil menyimpan ${berhasil} produk dan gagal ${gagal} produk`,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
  async bulkDelete(payload: DeleteArrayDto): Promise<ResponseSuccess> {
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
        message: `Berhasil menghapus produk sebanyak ${berhasil} dan gagal menghapus sebanyak ${gagal} `,
        data: payload,
      };
    } catch {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
