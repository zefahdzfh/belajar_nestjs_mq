import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PtsDto, CreateMobilArrayDto, CreateMobilDto } from './pts-2023.dto';
import { validate } from 'class-validator';

@Injectable()
export class Pts2023Service {
  private nextId = 2;
  private mobil: PtsDto[] = [
    {
      id: 1,
      nama: 'zefa',
      merek: 'toyota',
      tipe: 'avanza',
      harga: 150000000,
      tahun: 2020,
    },
  ];

  getAllMobil(): {
    id: number;
    nama: string;
    merek: string;
    tipe: string;
    harga: number;
    tahun: number;
  }[] {
    return this.mobil;
  }

  async createMobil(payload: CreateMobilDto): Promise<PtsDto> {
    const newMobil: PtsDto = {
      id: this.nextId,
      nama: payload.nama,
      merek: payload.merek,
      tipe: payload.tipe,
      harga: payload.harga,
      tahun: payload.tahun,
    };

    const errors = await validate(newMobil); // Validate the new mobil

    if (errors.length > 0) {
      throw new BadRequestException(
        'Invalid input data',
        JSON.stringify(errors),
      );
    }

    this.mobil.push(newMobil);
    this.nextId++;

    return newMobil;
  }

  getDetail(id: number): {
    id: number;
    nama: string;
    merek: string;
    tipe: string;
    harga: number;
    tahun: number;
  } {
    const mobil = this.mobil.find((item) => item.id === id);

    if (!mobil) {
      throw new NotFoundException('Mobil tidak ditemukan');
    }

    return mobil;
  }

  updateMobil(id: number, payload: any) {
    const { nama, merek, tipe, harga, tahun } = payload;
    const mobilIndex = this.findMobilById(id);

    if (mobilIndex === -1) {
      throw new NotFoundException('Mobil tidak ditemukan');
    }

    this.mobil[mobilIndex] = {
      id,
      nama: nama || this.mobil[mobilIndex].nama,
      merek: merek || this.mobil[mobilIndex].merek,
      tipe: tipe || this.mobil[mobilIndex].tipe,
      harga: harga || this.mobil[mobilIndex].harga,
      tahun: tahun || this.mobil[mobilIndex].tahun,
    };

    return {
      status: 'ok',
      message: 'Berhasil memperbaharui mobil',
    };
  }

  deleteMobil(id: number): { status: string; message: string } {
    const mobilIndex = this.findMobilById(id);

    if (mobilIndex === -1) {
      throw new NotFoundException('Mobil tidak ditemukan');
    }

    this.mobil.splice(mobilIndex, 1);

    return {
      status: 'ok',
      message: 'Berhasil menghapus mobil',
    };
  }

  getMobilDetail(id: number): {
    id: number;
    nama: string;
    merek: string;
    tipe: string;
    harga: number;
    tahun: number;
  } {
    const mobilIndex = this.findMobilById(id);

    if (mobilIndex === -1) {
      throw new NotFoundException('Mobil tidak ditemukan');
    }

    return this.mobil[mobilIndex];
  }

  createBulkMobil(mobils: CreateMobilDto[]): {
    status: string;
    message: string;
  } {
    const newMobils = mobils.map((payload, index) => ({
      id: index + 1, // Generate ID sequentially
      nama: payload.nama,
      merek: payload.merek,
      tipe: payload.tipe,
      harga: payload.harga,
      tahun: payload.tahun,
    }));

    this.mobil.push(...newMobils);

    return {
      status: 'ok',
      message: 'Berhasil menambahkan mobil',
    };
  }

  deleteBulkMobil(ids: number[]): { status: string; message: string } {
    ids.forEach((id) => {
      const mobilIndex = this.findMobilById(id);
      if (mobilIndex !== -1) {
        this.mobil.splice(mobilIndex, 1);
      }
    });

    return {
      status: 'ok',
      message: 'Berhasil menghapus mobil',
    };
  }

  private findMobilById(id: number): number {
    return this.mobil.findIndex((mobil) => mobil.id === id);
  }
}
