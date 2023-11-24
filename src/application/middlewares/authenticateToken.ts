import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpStatusCode from '../utils/exceptions/statusCode';
import { IUser } from '../../interfaces/user.interface';
import { secretKey } from '../utils/tokenForAuth/generateToken';

export interface RequestWithUser extends Request {
  user?: IUser;
}

export async function authenticateToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: 'Unauthorized - Invalid token' });
  }
}