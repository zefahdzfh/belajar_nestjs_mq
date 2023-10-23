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
import {
  BookDto,
  CreateBookDto,
  UpdateBookDto,
  createBookArrayDto,
  FindBookDto,
} from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
import { async } from 'rxjs';
import BaseResponse from 'src/utils/response/base.respone';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

  private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: 'HTML CSS',
      author: 'Hudzaifah',
      year: 2023,
    },
  ];

  async getAllBooks(query: FindBookDto): Promise<ResponsePagination> {
    console.log('uqwey', query);
    const { page, pageSize, title, author, from_year, to_year, limit } = query;
    const filter: {
      [key: string]: any;
    } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }
    const total = await this.bookRepository.count({
      where: filter,
    });
    const book = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: Number(pageSize),
    });
    return this._pagination(
      'Buku telah berhasil ditemukan',
      book,
      total,
      page,
      pageSize,
    );
  }

  getAllBook(): {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] {
    return this.books;
  }

  async createBook(payload: CreateBookDto): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);
      const { title, author, year } = payload;

      const bookSave = await this.bookRepository.save({
        title: title,
        author: author,
        year: year,
      });

      // const title = payload.title;
      // const author = payload.author;
      // const year = payload.year;

      // this.books.push({
      //   id: new Date().getTime(),
      //    title,
      //   author,
      //  year,
      // });

      return this._success('berhasil cuy', bookSave);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const book = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });

    console.log('book', book);

    if (book === null) {
      throw new NotFoundException(`Buku Dengan id ${id} tidak ditemukan`);
    }

    return {
      status: 'ok',
      message: 'berhasil',
      data: book,
    };
  }

  async updateBook(
    id: number,
    payload: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const book = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });
    if (book === null) {
      throw new NotFoundException(`Buku Dengan id ${id} tidak ditemukan`);
    }

    const update = await this.bookRepository.save({ ...payload, id: id });

    return {
      status: 'ok',
      message: 'Berhasil memperbaharui buku',
      data: update,
    };
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return {
      status: 'ok',
      message: 'berhasil',
      data: this.books,
    };
  }

  private findBookById(id: number) {
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan ${id} tidak ditemukan`);
    }

    return bookIndex;
  }
  async bulkCreate(payload: createBookArrayDto): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);

      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.data.map(async (item) => {
          try {
            await this.bookRepository.save(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menambahkan buku sebanyak ${berhasil} dan gagal sebanyak ${gagal} `,
        data: payload,
      };
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(payload: any): Promise<ResponseSuccess> {
    try {
      console.log('pay', payload);

      let berhasil = 0;
      let gagal = 0;

      await Promise.all(
        payload.delete.map(async (item) => {
          try {
            const check = await this.bookRepository.findOne({
              where: {
                id: item,
              },
            });
            if (!check)
              throw new NotFoundException(
                `Buku dengan id ${item} tidak ditemukan`,
              );
            await this.bookRepository.delete(item);
            berhasil = berhasil + 1;
          } catch {
            gagal = gagal + 1;
          }
        }),
      );
      return {
        status: 'ok',
        message: `Berhasil menghapus buku sebanyak ${berhasil} dan gagal menghapus sebanyak ${gagal} `,
        data: payload,
      };
    } catch {
      throw new HttpException('ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
