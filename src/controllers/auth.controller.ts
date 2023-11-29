import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import {
  generateAccessToken,
  refreshTokenSecretKey,
} from '../application/utils/tokenForAuth/generateToken';
import { IUser } from '../interfaces/user.interface';
import * as jwt from 'jsonwebtoken';

export async function register(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    const newUser = await authService.register(req.body);
    return res
      .status(HttpStatusCode.CREATED)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if ((error as HttpException).status) {
      return res
        .status((error as HttpException).status)
        .json({ error: (error as HttpException).message });
    } else {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { accessToken, refreshToken } = await authService.login(req.body);
    const secureOption = process.env.NODE_ENV === 'production';

    const sameSiteOption = secureOption ? 'None' : 'Lax';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: secureOption,
      sameSite: sameSiteOption as any,
    });
    return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken });
  } catch (error) {
    if ((error as HttpException).status) {
      return res
        .status((error as HttpException).status)
        .json({ error: (error as HttpException).message });
    } else {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  }
}

export async function refresh(req: Request, res: Response): Promise<Response> {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        'Refresh token is missing',
      );
    }

    const decoded = jwt.verify(refreshToken, refreshTokenSecretKey);

    const accessToken = generateAccessToken(decoded as IUser);

    res.cookie('access_token', accessToken, { httpOnly: true });
    return res.status(HttpStatusCode.OK).json({ accessToken });
  } catch (error) {
    if ((error as HttpException).status) {
      return res
        .status((error as HttpException).status)
        .json({ error: (error as HttpException).message });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ error: 'Token has expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ error: 'Invalid token' });
    } else {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  }
}
