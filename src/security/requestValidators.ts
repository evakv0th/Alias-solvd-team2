import { Request, Response, NextFunction } from "express";
import HttpStatusCode from  '../application/utils/exceptions/statusCode';
import { bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler";

export function validateRegisterRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("username") });
  }

  if (!password) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("password") });
  }

  next();
}

export function validateLoginRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("username") });
  }

  if (!password) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("password") });
  }

  next();
}

export function validateRefreshRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const { refreshToken } = req.body;

  if(!refreshToken) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: "Refresh token is missing" });
  }
    
  next();
}

