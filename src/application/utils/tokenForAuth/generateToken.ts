import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../../../interfaces/user.interface';

dotenv.config();

export const secretKey = process.env.SECRET_KEY as string;
export const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY as string;

export function generateAccessToken(user: IUser): string {
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    secretKey,
    { expiresIn: process.env.ACCESS_TOKEN_EXP },
  );
  return token;
}

export function generateRefreshToken(user: IUser): string {
  const refreshToken = jwt.sign(
    { userId: user._id, username: user.username },
    refreshTokenSecretKey,
    { expiresIn: process.env.REFRESH_TOKEN_EXP },
  );
  return refreshToken;
}
