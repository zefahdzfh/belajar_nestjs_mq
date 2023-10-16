import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Pts2023Service } from './pts-2023.service';
import { CreateMobilDto, PtsDto, CreateBulkMobilDto } from './pts-2023.dto';

@Controller('pts-2023')
export class Pts2023Controller {
  constructor(private readonly pts2023Service: Pts2023Service) {}

  @Get('list')
  getAllMobil() {
    return this.pts2023Service.getAllMobil();
  }

  @Post('create')
  createMobil(@Body() createMobilDto: CreateMobilDto) {
    return this.pts2023Service.createMobil(createMobilDto);
  }
  @Put('update/:id')
  updateMobil(@Param('id') id: string, @Body() payload: any) {
    return this.pts2023Service.updateMobil(Number(id), payload);
  }

  @Get('detail/:id')
  getMobilDetail(@Param('id') id: number) {
    return this.pts2023Service.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteMobil(@Param('id') id: number) {
    return this.pts2023Service.deleteMobil(+id);
  }

  @Post('createBulkMobil')
  createBulkMobil(@Body() createBulkMobilDto: CreateBulkMobilDto) {
    return this.pts2023Service.createBulkMobil(createBulkMobilDto.data);
  }

  @Delete('deleteBulkMobil')
  deleteBulkMobil(@Body() ids: number[]) {
    return this.pts2023Service.deleteBulkMobil(ids);
  }
}
