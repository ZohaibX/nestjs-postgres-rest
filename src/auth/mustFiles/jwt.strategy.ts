import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../auth.repository';
import { JwtPayload } from '../jwt-payload.interface';
import { User } from '../auth.entity';
import * as config from 'config';

// provide in the headers
// Authorization   Bearer<one space>jwtKey

// JWT key expires in 1h , so get another if some isn't working

//! Special File
//! This file and this class (JwtStrategy) will acquire JWT token from headers
//! will decode the token and with send decoded user's data to request
//! so we can access user as req.user

const jwtConfig: { secret: string } = config.get('jwt');

@Injectable() // so we can inject it to any other file
export class JwtStrategy extends PassportStrategy(Strategy) {
  // must provide UserRepository in constructor
  constructor(
    @InjectRepository(UserRepository) // injected UserRepository
    private userRepo: UserRepository, // initialized UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY || jwtConfig.secret,
    });
  }

  // this is a main function
  async validate(
    payload: JwtPayload,
  ): Promise<User> /* thats what it returns  */ {
    const { username } = payload;

    const user = await this.userRepo.findOne({ username }); // finding the user with username

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
