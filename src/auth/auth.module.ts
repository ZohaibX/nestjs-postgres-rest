import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './mustFiles/jwt.strategy';
import * as config from 'config';

const jwtConfig: { expiresIn: number; secret: string } = config.get('jwt');

@Module({
  // Look at the imports
  imports: [
    // Passport Module
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // JwtModule with secret key and expiry time
    JwtModule.register({
      secret: process.env.JWT_KEY || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn, // 1h
      },
    }),
    // TypeOrmModule providing auth repository
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Look at the providers, we provided JwtStrategy
  exports: [JwtStrategy, PassportModule], // in Exports , we exported jwtStrategy and passport module, so other modules may use them
})
export class AuthModule {}
