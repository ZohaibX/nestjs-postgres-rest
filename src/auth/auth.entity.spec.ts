import { User } from './auth.entity';
import * as bcrypt from 'bcryptjs';

describe('Validates User Password', () => {
  let user;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword'; // ot is encrypted password
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });

  it('returns true as password is valid', async () => {
    bcrypt.hash.mockReturnValue('testPassword');
    const result = await user.validatePassword('12345'); // as we provided some password .
    // it will encode it with salt and return an encrypted password which wh have already saved in db, so we'll get true
    expect(result).toBe(true);
  });

  it('returns false as password is invalid', async () => {
    bcrypt.hash.mockReturnValue('wrongPassword'); // we will get a wrong password because right password is testPassword which we will get as return
    const result = await user.validatePassword('12345');
    expect(result).toBe(false);
  });
});
