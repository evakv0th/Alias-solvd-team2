import * as jwt from 'jsonwebtoken';
import { IUser } from '../../../../interfaces/user.interface';
import { generateAccessToken, generateRefreshToken } from '../generateToken';

jest.mock('jsonwebtoken');

jest.mock('../generateToken', () => {
  return {
    secretKey: 'mock_secret_key',
    refreshTokenSecretKey: 'mock_refresh_secret_key',
    generateAccessToken: jest.requireActual('../generateToken').generateAccessToken,
    generateRefreshToken: jest.requireActual('../generateToken').generateRefreshToken,
  };
});


describe('Token Generation', () => {
    const user: IUser = {
        _id: '1',
        username: 'test',
        password: 'test',
        createdAt: new Date(),
        stats: {
          roundsPlayed: 1,
          wordsGuessed: 1,
        },
      };
    
      beforeEach(() => {
        (jwt.sign as jest.Mock).mockClear();
        (jwt.sign as jest.Mock).mockImplementation((payload, secretOrPrivateKey) => {
          return `mocked_token_for_${payload.userId}_with_secret_${secretOrPrivateKey}`;
        });
      });
    
      it('should generate an access token', () => {
        const token = generateAccessToken(user);
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: user._id, username: user.username },
          'secret',
          { expiresIn: '1h' },
        );
        expect(token).toBe(`mocked_token_for_${user._id}_with_secret_secret`); 
      });
    
      it('should generate a refresh token', () => {
        const refreshToken = generateRefreshToken(user);
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: user._id, username: user.username },
          'refresh-secret',
          { expiresIn: '7d' },
        );
        expect(refreshToken).toBe(`mocked_token_for_${user._id}_with_secret_refresh-secret`);
      });
});