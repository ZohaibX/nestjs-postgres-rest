import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger()

  constructor(
    @InjectRepository(UserRepository)
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ signToken: string }> {
    const username = await this.userRepo.signUp(authCredentialsDto);

    const payload: JwtPayload = { username };
    const signToken = this.jwtService.sign(payload);

    this.logger.debug(`Token signed with the payload ${JSON.stringify(payload)} `)
    return { signToken };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ signToken: string }> {
    const username = await this.userRepo.validateUserAccount(
      authCredentialsDto,
    );

    if (!username) throw new UnauthorizedException('Invalid Credentials');

    const payload: JwtPayload = { username };
    const signToken = this.jwtService.sign(payload);

    this.logger.debug(`Token signed with the payload ${JSON.stringify(payload)} `)

    return { signToken };
  }
}
