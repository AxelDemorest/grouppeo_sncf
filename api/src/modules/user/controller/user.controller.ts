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
  NotFoundException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { userDTO } from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../service/user.service';

@Controller('api/user')
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

  @Get('/agents')
  async getAllAgents() {
    return this.userService.getAgents();
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

  @Post('/:user_id/change-password')
  async changePassword(
    @Param('user_id') user_id: string,
    @Body() user: { password: string },
  ) {
    return this.userService.changePassword(user_id, user.password);
  }

  @Post('/:day/:user_id')
  async createUserDay(
    @Res() res,
    @Param('day') day: string,
    @Param('user_id') user_id: number,
  ) {
    const user = await this.userService.findUserById(user_id);
    if (!user) throw new NotFoundException('User not found');

    const userDay = await this.userService.createUserDay(user, day);
    if (!userDay)
      throw new ForbiddenException('User already assign to this day');

    return res.status(HttpStatus.OK).json({
      message: 'User has been submitted successfully!',
      post: userDay,
    });
  }

  @Get('/today/agents')
  async getAgentsFromDay(@Query('day') day: string) {
    return this.userService.getAgentsFromDay(day);
  }

  @Get('/day/agents/count/:day')
  async getAgentCountFromDay(@Param('day') day: string) {
    return this.userService.getAgentCountFromDay(day);
  }

  @Get('/planning/:planning_date/users')
  async getUsersFromPlanning(@Param('planning_date') planning_date: string) {
    return this.userService.getUsersFromPlanning(planning_date);
  }

  @Get('/list/counts')
  async getGroupCountsForNext5Days() {
    return await this.userService.getUsersCountsForNext5Days();
  }

  @Patch('/radios/assign')
  assignRadioToUser(@Body() body: { user_cp: string; radio_number: string }) {
    return this.userService.assignRadioToUser(body);
  }
}
