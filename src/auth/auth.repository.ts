import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';

//! we will only save user or signIn and we will only return user.username here -- no jwt work here
//! all functional params are provided by service file , so no need for documentation of functional params

@EntityRepository(User) // Repository of the entity
export class UserRepository extends Repository<
  User
> /** extends Repository and User is actual entity */ {
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> /* as this fn just returns a string (username) */ {
    const { username, password } = authCredentialsDto;

    const user = this.create(); // that's how we create a new user
    // we could also say new User(); -- this.create() is used when we want tests

    user.username = username;
    user.salt = await bcrypt.genSalt(); // we assigned salt to user data
    // so when we verify, we will hash the password with same salt and if password and salt returns some hash and we will verify
    user.password = await bcrypt.hash(password, user.salt); // user.password will be saved as a hashed password

    //! Logic of verification of password -- will be used in signing in , (validateUserAccount())
    // in user.password, we have hashed version of password
    // and in user.salt , we have the salt we used to hash the password
    // so when user provides some password, we will hash that with user.salt
    // and if userProvidedPassword+user.salt becomes as same as user.password, password will be verified

    try {
      await user.save();
      return user.username;
    } catch (error) {
      // console.log(error.code); // i can check the error code by make a mistake by creating existing account
      if (error.code === '23505') {
        // if username is duplicate, we will get this error code
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserAccount(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username: username });

    if (!user) throw new NotFoundException('User not found');

    const validatePassword = await user.validatePassword(password);
    //! Logic of verification of password -- everything is from signUp function aboves
    // in user.password, we have hashed version of password
    // and in user.salt , we have the salt we used to hash the password
    // so when user provides some password, we will hash that with user.salt
    // and if userProvidedPassword+user.salt becomes as same as user.password, password will be verified

    if (user && validatePassword) return user.username;
    return null;
  }
}
