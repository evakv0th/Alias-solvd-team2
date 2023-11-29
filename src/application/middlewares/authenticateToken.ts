import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import HttpStatusCode from '../utils/exceptions/statusCode';
import {IUser} from '../../interfaces/user.interface';
import {secretKey} from '../utils/tokenForAuth/generateToken';
export interface RequestWithUser extends Request {
  user?: IUser;
}

export async function authenticateToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  let token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    token = req.cookies['access_token'];
  }
  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string, username: string };
    req.user = {_id: decoded.userId, username: decoded.username} as IUser;

    next();
  } catch (error) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ error: 'Unauthorized - Invalid token' });
  }
}
