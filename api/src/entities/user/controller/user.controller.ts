import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Param,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { userDTO } from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user')
  async createUser(@Res() res, @Body() user: userDTO) {
    const newUser = await this.userService.createUser(user);
    return res.status(HttpStatus.OK).json({
      message: 'User has been submitted successfully!',
      post: newUser,
    });
  }

  @Get('/user/:email')
  async findOne(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Get('/user')
  async getAllUsers() {
    return this.userService.getUsers();
  }

  @Patch('/:user_id')
  update(
    @Param('user_id') user_id: number,
    @Body() user: userDTO,
  ): Promise<User> {
    return this.userService.updateUser(user_id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
