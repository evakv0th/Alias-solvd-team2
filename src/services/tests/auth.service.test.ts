import * as authService from '../auth.service';
import { userService } from '../user.service';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import bcrypt from 'bcrypt';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('../user.service', () => ({
  userService: {
    existsByUsername: jest.fn(),
    create: jest.fn(),
    getByUsername: jest.fn(),
  },
}));


describe('Auth Service', () => {
  describe('register', () => {
    it('should throw an error if username or password is not provided', async () => {
      await expect(authService.register({ username: '', password: '' })).rejects.toThrow(HttpException);
    });

    it('should throw an error if the username already exists', async () => {
      (userService.existsByUsername as jest.Mock).mockResolvedValue(true);
      await expect(authService.register({ username: 'existingUser', password: 'password' }))
          .rejects
          .toBeInstanceOf(HttpException);
    });

    it('should register a new user successfully', async () => {
      (userService.existsByUsername as jest.Mock).mockResolvedValue(false);
      (userService.create as jest.Mock).mockResolvedValue({ id: 'newUserId' });

      const newUser = { username: 'newUser', password: 'password' };
      await expect(authService.register(newUser)).resolves.toEqual(newUser);
    });
  });

  describe('login', () => {
    const mockUser = { _id: 'userId', username: 'testUser', password: 'password' };

    it('should throw an error if username or password is not provided', async () => {
      await expect(authService.login({ username: '', password: '' })).rejects.toThrow(HttpException);
    });

    it('should throw an error if credentials are incorrect', async () => {
      (userService.getByUsername as jest.Mock).mockResolvedValue(mockUser);
      await expect(authService.login({ username: 'testUser', password: 'wrongPassword' }))
          .rejects.toThrow(HttpException);
    });

    it('should log in a user successfully and return tokens', async () => {
      const mockUser = { _id: 'userId', username: 'testUser', password: 'hashedPassword' };
      (userService.getByUsername as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login({ username: 'testUser', password: 'password' }))
          .resolves
          .toMatchObject({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          });
    });

    it('should throw an error if userService throws an error', async () => {
      (userService.getByUsername as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.BAD_REQUEST, 'User not found'));
      await expect(authService.login({ username: 'testUser', password: 'password' }))
          .rejects
          .toBeInstanceOf(HttpException);
    });
  });
});