import * as authService from '../auth.service';
import { userService } from '../user.service';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';

// Mock the userService
jest.mock('../user.service', () => ({
    userService: {
        exists: jest.fn(),
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
      (userService.exists as jest.Mock).mockResolvedValue(true);
      await expect(authService.register({ username: 'existingUser', password: 'password' })).rejects.toThrow(HttpException);
    });

    it('should register a new user successfully', async () => {
      (userService.exists as jest.Mock).mockResolvedValue(false);
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
      await expect(authService.login({ username: 'testUser', password: 'wrongPassword' })).rejects.toThrow(HttpException);
    });

    it('should log in a user successfully and return tokens', async () => {
      (userService.getByUsername as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login({ username: 'testUser', password: 'password' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw an error if userService throws an error', async () => {
      (userService.getByUsername as jest.Mock).mockRejectedValue(new Error('User not found'));
      await expect(authService.login({ username: 'testUser', password: 'password' })).rejects.toThrow(HttpException);
    });
  });
});
