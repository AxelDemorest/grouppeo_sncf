import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'user_email',
      passwordField: 'user_password',
    });
  }

  async validate(user_email: string, user_password: string): Promise<any> {
    const user = this.authService.validateUser(user_email, user_password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
