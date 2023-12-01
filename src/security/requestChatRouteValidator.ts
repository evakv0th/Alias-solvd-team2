import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { paramsErrorMessage, bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler"

export function validateGetChatRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage("id")}`}); 
    }
    next();
  }   
}

export function validateUpdateChatRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const chat = req.body;

    if (!chat) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage("chat")}`});
    }

    if (!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage("id")}`}); 
    }
    next();
  }   
}

export function validateDeleteChatRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage("id")}`}); 
    }
    next();
  }   
}

export function validateViewChatRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(!id || id === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage("id")}`}); 
    }
    next();
  }   
}


