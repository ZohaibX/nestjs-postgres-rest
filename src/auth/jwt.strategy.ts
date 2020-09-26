import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './auth.entity';
import * as config from 'config';

// provide in the headers
// Authorization   Bearer<one space>jwtKey

// JWT key expires in 1h , so get another if some isn't working

const jwtConfig: { secret: string } = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY || jwtConfig.secret,
    });
  }

  // this is a main function
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userRepo.findOne({ username });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
