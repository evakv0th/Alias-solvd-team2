import { Request, Response, NextFunction } from "express";
import HttpStatusCode from  '../application/utils/exceptions/statusCode';

export function validateRegisterRequest(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username || !req.body.password) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Missing required fields" });
      }
      next();
    }
}

export function validateLoginRequest(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    if(!req.body.username || !req.body.password) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: "Missing required fields" });
    }
    next();
  }
}

export function validateRefreshRequest(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if(!refreshToken) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: "Refresh token is missing" });
    }
    next();
  }
}

