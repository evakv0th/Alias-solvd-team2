import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import HttpException from "../application/utils/exceptions/http-exceptions";

export function validateCreateTeamRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const teamName = req.body.name;
    
    if (!teamName) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json(new HttpException(HttpStatusCode.BAD_REQUEST, "error"));
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
    
    if (!id) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json(new HttpException(HttpStatusCode.BAD_REQUEST, "error"));
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

    if (!id) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json(new HttpException(HttpStatusCode.BAD_REQUEST, "error"));
    }

    if (!members || members.length === 0) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json(new HttpException(HttpStatusCode.BAD_REQUEST, "error"));
    }

    next();
  }
}

export function validateAddMemberByNameRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const username = req.params.username;

    if (!id) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json(new HttpException(HttpStatusCode.BAD_REQUEST, "error"));
    }

    if (!username) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json(new HttpException(HttpStatusCode.BAD_REQUEST, "error"));
    }

    next();
  }
}


