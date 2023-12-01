import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { paramsErrorMessage, bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler"

export function validateGetUserRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const id = req.params.id;

  if (!id || id === " ") {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: paramsErrorMessage("id") });
  }

  next();
}

export function validatePostUserRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const newUser = req.body;

  if (!newUser) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("newUser") }); 
  } 

  next();
}

export function validatePatchUserRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const id = req.params.id;
  const newUser = req.body;

  if (!id || id === " ") {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: paramsErrorMessage("id") });
  }

  if (!newUser) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("newUser") }); 
  } 

  next();
}

export function validateDeliteUserRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const id = req.params.id;

  if (!id || id === " ") {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: paramsErrorMessage("id") })
  }

  next();
}

