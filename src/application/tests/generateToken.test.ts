import * as jwt from 'jsonwebtoken';
import { IUser } from '../../interfaces/user.interface';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenForAuth/generateToken';

jest.mock('jsonwebtoken');

describe('Token Generation', () => {
    const user: IUser = {
        id: '1',
        username: 'test',
        password: 'test',
        createdAt: new Date(),
        stats: {
          roundPlayed: 1,
          wordsGuessed: 1,
        },
      };
    
    beforeEach(() => {
        // Clear mock calls between tests
        (jwt.sign as jest.Mock).mockClear();
    
        // Set environment variables for the tests
        process.env.SECRET_KEY = 'secret';
        process.env.REFRESH_SECRET_KEY = 'refresh-secret';
        process.env.ACCESS_TOKEN_EXP = '1h';
        process.env.REFRESH_TOKEN_EXP = '7d';
    
        // Provide a mock implementation
        (jwt.sign as jest.Mock).mockImplementation((payload, secretOrPrivateKey, options) => {
          if (typeof secretOrPrivateKey !== 'string') {
            throw new Error('The secret or private key must be a string');
          }
          // Simulate JWT generation by returning a string that includes the userId to ensure uniqueness
          return `mocked_token_for_${payload.userId}_with_secret_${secretOrPrivateKey}`;
        });
      });
    
    it('should generate an access token', () => {
        const token = generateAccessToken(user);
        generateAccessToken(user);
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: user.id, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: process.env.ACCESS_TOKEN_EXP },
        );
        expect(token).toBe(`mocked_token_for_${user.id}_with_secret_${ process.env.SECRET_KEY}`); 
    });
    
    it('should generate a refresh token', () => {
      const refreshToken = generateRefreshToken(user);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, username: user.username },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXP },
      );
      expect(refreshToken).toBe(`mocked_token_for_${user.id}_with_secret_${process.env.REFRESH_SECRET_KEY}`);
  });
  
});