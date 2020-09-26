import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from './auth.repository';
import { User } from './auth.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AUTH REPOSITORY', () => {
  let userRepository;
  const mockCredentialsDTO = { username: 'test', password: 'Isadnb122' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('SIGN UP', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save: save });
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined); // must not be an error with a code
      expect(userRepository.signUp(mockCredentialsDTO)).resolves.not.toThrow();
    });

    it('throws a conflict error', () => {
      save.mockResolvedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a Internal Server error', () => {
      save.mockResolvedValue({ code: '123123' }); // Internal Server Error
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('VALIDATE USER ACCOUNT', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();

      user = new User();
      user.username = 'test';
      user.validatePassword = jest.fn();
    });

    it('returns a username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserAccount(
        mockCredentialsDTO,
      );
      expect(result).toEqual('test');
    });

    it('returns a null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(
        userRepository.validateUserAccount(mockCredentialsDTO),
      ).rejects.toThrow(NotFoundException);
    });

    it(`returns a null as password isn't valid`, async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserAccount(
        mockCredentialsDTO,
      );
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('HASH PASSWORD', () => {
    it('calls bcrypt.hash to generate a password', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('someHash');
      const result = await bcrypt.hash('testPassword', 'testSalt');
      expect(result).toEqual('someHash');
    });
  });
});
