import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { paramsErrorMessage, bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler"

export function validateGetVocabularyByIdRout(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const id = req.params.id;

  if(!id || id === " ") {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: paramsErrorMessage("id") }); 
  }

  next();  
}

export function validateCreateVocabularyRout(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const vocabulary = req.body;

  if(!vocabulary || vocabulary.words.length === 0) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("vocabulary") }); 
  }

  next();
}

export function validateUpdateVocabularyRout(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const id = req.params.id
  const vocabulary = req.body;

  if (!id || id === " ") {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: paramsErrorMessage("id") });
  }

  if (!vocabulary || vocabulary.words.length === 0) {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: bodyErrorMessage("vocabulary") }); 
  }

  next();  
}

export function validateDeleteVocabularyRout(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const id = req.params.id
    
  if (!id || id === " ") {
    return res
    .status(HttpStatusCode.BAD_REQUEST)
    .json({ error: paramsErrorMessage("id") });
  }
    
  next(); 
}


