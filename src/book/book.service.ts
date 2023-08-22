import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseSuccess } from 'src/interface/response.interface';
import { BookDto, CreateBookDto, UpdateBookDto } from './book.dto';

@Injectable()
export class BookService {
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

  getAllBook(): {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] {
    return this.books;
  }

  createBook(payload: CreateBookDto): ResponseSuccess {
    console.log('pay', payload);

    // const title = payload.title;
    // const author = payload.author;
    // const year = payload.year;

    const { title, author, year } = payload;
    this.books.push({
      id: new Date().getTime(),
      title,
      author,
      year,
    });

    return {
      status: 'ok',
      message: 'berhasil',
    };
  }

  getDetail(id: number): {
    id?: number;
    title: string;
    author: string;
    year: number;
  } {
    const bookIndex = this.findBookById(id);
    console.log('book index', bookIndex);
    const book = this.books[bookIndex];

    return book;
  }

  updateBook(id: number, payload: UpdateBookDto): ResponseSuccess {
    const { title, author, year } = payload;
    const bookIndex = this.findBookById(id);
    this.books[bookIndex].title = title;
    this.books[bookIndex].author = author;
    this.books[bookIndex].year = year;
    return {
      status: 'ok',
      message: 'Berhasil memperbaharui buku',
    };
  }

  deleteBook(id: number): ResponseSuccess {
    const bookIndex = this.findBookById(id);
    this.books.splice(bookIndex, 1);
    return {
      status: 'ok',
      message: 'Berhasil menghapus buku',
    };
  }

  private findBookById(id: number) {
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan ${id} tidak ditemukan`);
    }

    return bookIndex;
  }
}
