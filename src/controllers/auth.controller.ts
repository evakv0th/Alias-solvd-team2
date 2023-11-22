import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import HttpException from '../utils/exceptions/http-exceptions';
import HttpStatusCode from '../utils/exceptions/statusCode';

export async function register(
  req: Request,
  res: Response,
): Promise<Response | void> {
  try {
    const newUser = await authService.register(req.body);
    return res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if ((error as HttpException).status) {
      return res.status((error as HttpException).status).json({ error: (error as HttpException).message });
    } else {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  }
}
