import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

//! This DTO will be used by signUp and signIn
//! but if we need some different data for any of them (signUp and signIn)
//! we could make another file like this and use that DTO in there
export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

// REGEX Exp is for strong password
/*
Passwords will contain at least 1 upper case letter
Passwords will contain at least 1 lower case letter
Passwords will contain at least 1 number or special character
There is no length validation (min, max) in this regex!
*/
