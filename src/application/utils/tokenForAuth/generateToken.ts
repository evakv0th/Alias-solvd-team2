import * as jwt from 'jsonwebtoken';
import { IUser } from '../../../interfaces/user.interface';

export const secretKey = 'temporary-secret-key';
export const refreshTokenSecretKey = 'temporary-refresh-token-secret-key';

export function generateAccessToken(user: IUser): string {
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    secretKey,
    { expiresIn: '1h' },
  );
  return token;
}

export function generateRefreshToken(user: IUser): string {
  const refreshToken = jwt.sign(
    { userId: user.id, username: user.username },
    refreshTokenSecretKey,
    { expiresIn: '7d' },
  );
  return refreshToken;
}
