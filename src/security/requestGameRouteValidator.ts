import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { paramsErrorMessage, bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler"

export function validateGameCreateRoute(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const teams = req.body.teams; 
  const options = req.body.options;

  if (!options) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("options") }); 
  } 

  if (!teams || teams.length < 2) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("teams") }); 
  }

  next();
}

export function validateGetGameRoute(
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

export function validateGameStartRoute(
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