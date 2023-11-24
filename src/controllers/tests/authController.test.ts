import request from 'supertest';
import app from '../../index'; 
import * as authService from '../../services/auth.service';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import jwt from 'jsonwebtoken';

jest.mock('../../services/auth.service');

describe('Auth Controller', () => {
  describe('register function', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { username: 'testuser', password: 'password' };
      (authService.register as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(mockUser);

      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body.user).toEqual(mockUser);
      expect(response.body.message).toBe('User registered successfully');
    });
  });

  

});