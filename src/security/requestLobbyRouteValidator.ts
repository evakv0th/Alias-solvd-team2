import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { paramsErrorMessage, bodyErrorMessage } from "../application/utils/errorRequestHandler/errorRequestHandler"

export function validateLobbyCreateRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const hostId = req.body.hostId; 
    const options = req.body.options;

    if (!hostId) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage('hostId')}` }); 
    } 

    if (!options) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage('options')}` }); 
    }

    next();
  }
}

export function validateJoinLobbyRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const gameId = req.params.gameId; 
    const options = req.body.options;

    if (!gameId || gameId === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('gameId')}` }); 
    }

    if (!options) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage('options')}` }); 
    }

    next();
  }
}

export function validateSelectTeamRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const gameId = req.params.gameId; 
    const userId = req.body.userId;
    const teamId = req.body.teamId;

    if (!gameId || gameId === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('gameId')}` }); 
    }

    if (!userId) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage('userId')}` }); 
    }

    if (!teamId) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage('teamId')}` }); 
    }

    next();
  }
}

export function validateLeaveLobbyRoute(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return(req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const gameId = req.params.gameId;

    if (!gameId || gameId === " ") {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${paramsErrorMessage('gameId')}` }); 
    }

    if (!userId) {
      return res
      .status(HttpStatusCode.BAD_REQUEST)
      .json({ error: `${bodyErrorMessage('userId')}` }); 
    }

    next();
  }
}
