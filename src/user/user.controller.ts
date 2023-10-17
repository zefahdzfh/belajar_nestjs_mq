import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { UpdateUserDto } from './user.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  getAlluser() {
    return this.userService.getAllUser();
  }

  @Post('create')
  createuser(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.updateUser(Number(id), payload);
  }

  @Get('detail/:id')
  getDetail(@Param('id') id: string) {
    return this.userService.getDetail(Number(id));
  }
  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
