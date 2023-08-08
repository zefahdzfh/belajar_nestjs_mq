import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { title } from 'process';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('list')
  getAllBook() {
    return this.bookService.getAllBook();
  }

  @Post('create')
  createBook(@Body() payload: any) {
    return this.bookService.createBook(payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }
}

const array = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
];
