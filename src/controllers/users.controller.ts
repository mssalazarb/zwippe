import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';

@Controller('/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  saveUser(@Body() user: User): Promise<GeneralResponse> {
    return this.usersService.saveUser(user);
  }

  @Put()
  updateUser(@Body() user: User): Promise<GeneralResponse> {
    return this.usersService.updateUser(user);
  }

  @Delete()
  deleteUser(@Query('email') userEmail: string): Promise<GeneralResponse> {
    return this.usersService.deleteUser(userEmail);
  }

  @Get('/all')
  getUsers(): Promise<GeneralResponse> {
    return this.usersService.getUsers();
  }

  @Get('/email')
  getUserByEmail(@Query('email') userEmail: string): Promise<GeneralResponse> {
    return this.usersService.getUserByEmail(userEmail);
  }
}
