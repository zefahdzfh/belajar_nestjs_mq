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
import { Pas2023Service } from './pas-2023.service';
// import { title } from 'process';

import { Pagination } from 'src/utils/decorator/pagination.decorator';
import {
  CreateProdukArrayDto,
  CreateProdukDto,
  DeleteArrayDto,
  FindProdukDto,
  UpdateProdukDto,
} from './pas-2023.dto';
import { ResponseSuccess } from 'src/interface';

@Controller('produk')
export class Pas2023Controller {
  constructor(private readonly pas2023Service: Pas2023Service) {}

  //   @Get('list')
  //   getAllProducts() {
  //     return this.pas2023Service.getAllProduk();
  //   }

  @Get('list')
  getAllProducts(@Query() query: FindProdukDto) {
    return this.pas2023Service.getAllProducts(query);
  }

  @Post('/create')
  createProduk(@Body() payload: CreateProdukDto) {
    return this.pas2023Service.createProduk(payload);
  }

  @Put('update/:id')
  updateProduk(@Param('id') id: number, @Body() payload: UpdateProdukDto) {
    return this.pas2023Service.updateProduk(id, payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.pas2023Service.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteProduk(@Param('id') id: string) {
    return this.pas2023Service.deleteProduk(Number(id));
  }

  @Post('/create/bulk')
  bulkCreateProduk(
    @Body() payload: CreateProdukArrayDto,
  ): Promise<ResponseSuccess> {
    return this.pas2023Service.bulkCreate(payload);
  }

  @Post('delete/bulk')
  deleteBulk(@Body() payload: DeleteArrayDto) {
    return this.pas2023Service.bulkDelete(payload);
  }
}
