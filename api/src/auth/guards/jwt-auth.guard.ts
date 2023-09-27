import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // Vous pouvez lancer une exception basée sur "info" ou "err" si quelque chose ne va pas
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
