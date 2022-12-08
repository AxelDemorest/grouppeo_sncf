import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user/models/user.entity';
import { UserService } from '../../entities/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new NotAcceptableException('could not find the user');
    //const passwordValid = await bcrypt.compare(password, user.user_password);
    if (user && password === user.user_password) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.user_mail, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
