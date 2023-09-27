import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Cela signifie que la stratégie vérifiera l'expiration du token
      secretOrKey: configService.get('JWT_SECRET'), // la clé secrète pour vérifier la signature
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
