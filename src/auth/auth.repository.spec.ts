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
  const mockCredentialsDTO = { username: 'test', password: 'Isadnb122' }; // input Data

  beforeEach(async () => {
    // must creating a new module
    const module = await Test.createTestingModule({
      providers: [UserRepository], // we are testing userRepository
    }).compile();

    // all providers are to initialize like this
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('SIGN UP', () => {
    let save;

    beforeEach(() => {
      save = jest.fn(); // save is a mock function now
      userRepository.create = jest.fn().mockReturnValue({ save: save }); // userRepository.create is a mock fn which will always return {save:save}
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined); // must not be an error with a code
      expect(userRepository.signUp(mockCredentialsDTO)).resolves.not.toThrow();
      // even save fn is undef, it will resolve and will not throw any error
    });

    it('throws a conflict error', () => {
      save.mockResolvedValue({ code: '23505' }); // it will always return this code for ConflictException
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        ConflictException,
      ); // even this is async fn but we don't do await fn bcoz it wil always throw an error and test will fail
      // we handle these fns as
      // expect(some_async_fn_without_any_await).rejects.toThrow(some_error_like_ConflictException)
    });

    it('throws a Internal Server error', () => {
      save.mockResolvedValue({ code: '123123' }); // Internal Server Error code
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        InternalServerErrorException,
      ); // even this is async fn but we don't do await fn bcoz it wil always throw an error and test will fail
      // we handle these fns as
      // expect(some_async_fn_without_any_await).rejects.toThrow(some_error_like_InternalServerErrorException)
    });
  });

  describe('VALIDATE USER ACCOUNT', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn(); // userRepository.findOne is a mock fn now

      // we create a new user , to validate Password
      user = new User();
      user.username = 'test';
      user.validatePassword = jest.fn(); // user.validatePassword is a mock fn now
    });

    it('returns a username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user); // userRepository.findOne always return a user with promise
      user.validatePassword.mockResolvedValue(true); // user.validatePassword always return true with a promise

      const result = await userRepository.validateUserAccount(
        mockCredentialsDTO,
      );
      // it catches no error -- so result have user.username
      expect(result).toEqual('test');
    });

    it('returns a null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null); // it will always return a null with promise
      expect(
        userRepository.validateUserAccount(mockCredentialsDTO),
      ).rejects.toThrow(NotFoundException);
      // even this is async fn but we don't do await fn bcoz it wil always throw an error and test will fail
      // we handle these fns as
      // expect(some_async_fn_without_any_await).rejects.toThrow(some_error_like_NotFoundException)
    });

    it(`returns a null as password isn't valid`, async () => {
      userRepository.findOne.mockResolvedValue(user); // it will always return a user with a promise
      user.validatePassword.mockResolvedValue(false); // but it will always fail with a promise

      const result = await userRepository.validateUserAccount(
        mockCredentialsDTO,
      );

      // in actual code, we don't throw any error if password is not valid, we return null
      // thats y we can call this function with await and we will get null

      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('HASH PASSWORD', () => {
    it('calls bcrypt.hash to generate a password', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('someHash'); // bcrypt.hash will always return 'someHash' with promise
      const result = await bcrypt.hash('testPassword', 'testSalt'); // we provide password and salt , but it will always return 'someHash'
      expect(result).toEqual('someHash');
    });
  });
});
