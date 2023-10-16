/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
// import { title } from 'process';
import {
  CreateBookDto,
  UpdateBookDto,
  createBookArrayDto,
  FindBookDto,
} from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  // @Get('list')
  // findAllBook(@Query() findBookDto: FindBookDto) {
  //   return this.bookService.getAllBooks(findBookDto);
  // }

  @Get('list')
  findAllBook(@Pagination() findBookDto: FindBookDto) {
    return this.bookService.getAllBooks(findBookDto);
  }

  @Post('create')
  createBook(@Body() payload: CreateBookDto) {
    return this.bookService.createBook(payload);
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }

  @Post('create/bulk')
  createBulk(@Body() payload: createBookArrayDto) {
    return this.bookService.bulkCreate(payload);
  }

  @Post('delete/bulk')
  deleteBulk(@Body() payload: any) {
    return this.bookService.bulkDelete(payload);
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
