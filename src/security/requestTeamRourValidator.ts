import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { paramsErrorMessage, bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler"

export function validateTeamCreateRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;

    if (!name) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage("name")}` }); 
    } 

    next();
  }
}

export function validateGetTeamRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('id')}` }); 
    } 

    next();
  }
}

export function validateUpdateTeamRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const members = req.body;

    if (!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('id')}` }); 
    }
    
    if (!members || members.length === 0) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage("members")}` }); 
    } 

    next();
  }
}

export function validateAddMembereByNameRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const username = req.params.username;

    if (!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('id')}` }); 
    }

    if (!username) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('username')}` }); 
    }

    next();
  }
}
