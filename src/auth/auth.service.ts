import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

//! All the function parameters we will get from controllers, so no need to document that
//! creating user and signing user will be done in repository file
//! and all jwt work will be done in here

//? we can also have ownership here as we can assign some property like owner , manager
//? and we can pass them in jwt and in frontend, we can know who is owner or manager

@Injectable() // Service file must be injectable
export class AuthService {
  // logger for logging
  private logger = new Logger();

  // in constructor, we must need to provide repository file
  constructor(
    @InjectRepository(UserRepository) // thats how to inject repository class
    private userRepo: UserRepository, // and we will initialize a variable for that class
    private jwtService: JwtService, // JwtService is imported from @nestjs/jwt // this is a special file auth.service  and we need to provide JwtService in here, so we can use here // as we will do jwt work in here
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ signToken: string }> /* Thats what this fn returns */ {
    const username = await this.userRepo.signUp(authCredentialsDto);
    // this.userRepo.signUp(authCredentialsDto) will return user.username or ConflictException or InternalServerErrorException
    // if we get some error thrown by the function, we will get an error and this function will automatically fail
    // so even if we handle error below, code will not reach below and already be failed with ConflictException or with other error

    // signing JWT with payload
    const payload: JwtPayload = { username }; // JwtPayload is an interface class defined in other file
    const signToken = this.jwtService.sign(payload); // signing with payload

    this.logger.debug(
      `Token signed with the payload ${JSON.stringify(payload)} `,
    );
    return { signToken };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ signToken: string }> /* Thats what this fn returns */ {
    const username = await this.userRepo.validateUserAccount(
      authCredentialsDto,
    );
    // this.userRepo.validateUserAccount(authCredentialsDto) will return user.username or NotFoundException or null
    // if we get some error thrown by the function, we will get an error and this function will automatically fail
    // so even if we handle error below, code will not reach below and already be failed with NotFoundException

    // if we get null from this.userRepo.validateUserAccount(authCredentialsDto)
    // we will handle that below

    if (!username) throw new UnauthorizedException('Invalid Credentials'); // if null, throw UnauthorizedException

    // signing token
    const payload: JwtPayload = { username }; // JwtPayload is an interface class defined in other file
    const signToken = this.jwtService.sign(payload); // signing with payload

    this.logger.debug(
      `Token signed with the payload ${JSON.stringify(payload)} `,
    );

    return { signToken };
  }
}
