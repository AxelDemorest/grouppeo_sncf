import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/models/user.entity';
import { UserService } from '../../modules/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new NotAcceptableException('could not find the user');
    const passwordValid = await bcrypt.compare(password, user.user_password);
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.user_mail,
      cp: user.user_cp,
      role: user.user_type,
      confirmed: user.confirmed,
      sub: user.user_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
