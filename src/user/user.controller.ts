import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  getAlluser() {
    return this.userService.getAllUser();
  }

  @Post('create')
  createuser(@Body() payload: any) {
    return this.userService.createUser(payload);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: string, @Body() payload: any) {
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
