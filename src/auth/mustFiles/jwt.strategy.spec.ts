import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../auth.repository';
import { User } from '../auth.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JWT STRATEGY', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    // must create a module
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy, // test for JwtStrategy Class
        { provide: UserRepository, useFactory: mockUserRepository }, // UserRepo which is injected in actual JwtStrategy class
      ],
    }).compile();

    // initializing all the providers
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('validates and return a user based on token', async () => {
    // we need a new User to signToken
    const user = new User();
    user.username = 'test'; // username is only thing required for signing

    userRepository.findOne.mockResolvedValue(user); // it will always find a user with a promise

    const result = await jwtStrategy.validate({ username: 'test' });
    // we will get data of user with this username and will return the user

    expect(result).toEqual(user);
  });

  it('throws an unauthorized exception as user cannot be found', () => {
    userRepository.findOne.mockResolvedValue(null); // user will never be found as it will always return null with promise

    expect(jwtStrategy.validate({ username: 'test' })).rejects.toThrow(
      UnauthorizedException,
    );
    // even this is async fn but we don't do await fn bcoz it wil always throw an error and test will fail
    // we handle these fns as
    // expect(some_async_fn_without_any_await).rejects.toThrow(some_error_like_UnauthorizedException)
  });
});
