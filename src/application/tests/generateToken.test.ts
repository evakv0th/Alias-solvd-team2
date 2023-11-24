import * as jwt from 'jsonwebtoken';
import { IUser } from '../../interfaces/user.interface';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenForAuth/generateToken';


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
    
    beforeAll(() => {
        process.env.SECRET_KEY = 'test-secret-key';
        process.env.REFRESH_SECRET_KEY = 'test-refresh-secret-key';
        process.env.ACCESS_TOKEN_EXP = '1h';
        process.env.REFRESH_TOKEN_EXP = '7d';
    });
    
    it('should generate an access token', () => {
        generateAccessToken(user);
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: user.id, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: process.env.ACCESS_TOKEN_EXP },
        );
    });
    
    it('should generate a refresh token', () => {
        generateRefreshToken(user);
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: user.id, username: user.username },
          process.env.REFRESH_SECRET_KEY,
          { expiresIn: process.env.REFRESH_TOKEN_EXP },
        );
    });
});