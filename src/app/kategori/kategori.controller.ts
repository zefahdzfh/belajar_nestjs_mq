import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  findAllKategori,
} from './kategori.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CreatedBy } from 'src/utils/decorator/createdBy.decorator';

@UseGuards(JwtGuard) //  implementasikan global guard pada semua endpont kategori memerlukan authentikasi saat request
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Post('create')
  async create(@CreatedBy() payload: CreateKategoriDto) {
    return this.kategoriService.create(payload);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() payload: UpdateKategoriDto) {
    return this.kategoriService.update(Number(id), payload);
  }

  @Get('list')
  async getAllCategory(@Pagination() query: findAllKategori) {
    //gunakan custom decorator yang pernah kita buat
    return this.kategoriService.getAllCategory(query);
  }
}
