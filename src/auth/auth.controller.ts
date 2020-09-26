import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './mustFiles/get-user.decorator';
import { User } from './auth.entity';

@Controller('auth')
export class AuthController {
  // must to provide service file in constructor
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto, // in body , we will provide input according to AuthCredentialsDto
    // and validationPipe will make sure that validation will be applied which we provided in AuthCredentialsDto
  ): Promise<{
    signToken: string;
  }> /* as we will receive promise of jwt token  */ {
    return this.authService.signUp(authCredentialsDto); // service file will handle signUp
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto, // in body , we will provide input according to AuthCredentialsDto
    // and validationPipe will make sure that validation will be applied which we provided in AuthCredentialsDto
  ): Promise<{
    signToken: string;
  }> /* as we will receive promise of jwt token  */ {
    return this.authService.signIn(authCredentialsDto); // service file will handle signIn
  }

  // this is just a test request to check @UseGuards(AuthGuard()) and @GetUser()
  @Post('/test')
  @UseGuards(AuthGuard()) // This statement will be used by the jwtStrategy file -- documentation is there
  test(@GetUser() user: User) {
    // GetUser is a custom decorator we must have in auth folder
    console.log(user);
  }
}
