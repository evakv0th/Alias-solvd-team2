import { Request, Response, NextFunction } from "express";
import HttpStatusCode from  '../application/utils/exceptions/statusCode';

export function validateRegisterRequest() {
  return(req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username || !req.body.password) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Missing required fields" })
      }
      next();
    }
}

export function validateLoginRequest() {
  return(req: Request, res: Response, next: NextFunction) => {
    if(!req.body.username || !req.body.password) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: "Missing required fields" })
    }
    next();
  }
}

export function validateRefreshRequest() {
  return(req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if(!refreshToken) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: "Refresh token is missing" })
    }
    next();
  }
}

