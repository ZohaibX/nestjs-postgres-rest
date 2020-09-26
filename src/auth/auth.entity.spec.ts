import { User } from './auth.entity';
import * as bcrypt from 'bcryptjs';

//! all the validation login is in entity file

describe('Validates User Password', () => {
  let user;

  beforeEach(() => {
    // first of all, we always want to create a new user
    user = new User();
    user.password = 'testPassword'; // ot is encrypted password
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn(); // bcrypt.hash just a mock fn
  });

  it('returns true as password is valid', async () => {
    bcrypt.hash.mockReturnValue('testPassword'); // so bcrypt.hash will always returns a hash value = "testPassword"
    // and 'testPassword' is equal to user.password, so it will always work.

    const result = await user.validatePassword('12345'); // as we provided some password .
    // it will encode it with salt and return an encrypted password which we have already saved in db, so we'll get true

    expect(result).toBe(true);
  });

  it('returns false as password is invalid', async () => {
    bcrypt.hash.mockReturnValue('wrongPassword'); // so bcrypt.hash will always returns a hash value = "wrongPassword"
    // and 'wrongPassword' is not equal to user.password, so it will always work.

    const result = await user.validatePassword('12345'); // as we provided some password .
    // it will encode it with salt and return an encrypted password which we have already saved in db (which is 'testPassword ), so we'll get false

    expect(result).toBe(false);
  });
});
