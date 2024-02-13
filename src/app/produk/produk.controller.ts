import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukArrayDto,
  UpdateProdukDto,
  findAllProduk,
} from './produk.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() payload: UpdateProdukDto) {
    return this.produkService.update(Number(id), payload);
  }

  @Delete('delete/:id')
  deleteProduk(@Param('id') id: string) {
    return this.produkService.deleteProduk(+id);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.produkService.getDetail(Number(id));
  }
}
