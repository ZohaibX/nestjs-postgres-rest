import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './auth.repository';
import { User } from './auth.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JWT STRATEGY', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('validates and return a user based on token', async () => {
    const user = new User();
    user.username = 'test';

    userRepository.findOne.mockResolvedValue(user);
    const result = await jwtStrategy.validate({ username: 'test' });
    expect(result).toEqual(user);
  });

  it('throws an unauthorized exception as user cannot be found', () => {
    userRepository.findOne.mockResolvedValue(null);
    expect(jwtStrategy.validate({ username: 'test' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
