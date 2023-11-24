import { Request, Response } from 'express';
import { lobbyService } from '../services/lobby.service';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import HttpException from '../application/utils/exceptions/http-exceptions';

class LobbyController {
  async createLobby(req: Request, res: Response) 
  {
    try 
    {
      // assuming hostId is sent in the request body
      const hostId = req.body.hostId; 
      // game options are sent in the request body
      const options = req.body.options;
      const gameId = await lobbyService.createLobby(hostId, options);
      res.status(HttpStatusCode.CREATED).json({ gameId });
    } 
    catch (error ) 
    {
      if (error instanceof HttpException) 
      {
        res.status(error.status).json({ message: error.message });
      } 
      else 
      {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }

  async joinLobby(req: Request, res: Response) 
  {
    try 
    {
      const userId = req.body.userId;
      const gameId = req.params.gameId; // assuming gameId is sent as a URL parameter
      const game = await lobbyService.joinLobby(userId, gameId);
      res.status(HttpStatusCode.OK).json(game);
    } 
    catch (error) 
    {
      if (error instanceof HttpException) 
      {
        res.status(error.status).json({ message: error.message });
      } 
      else 
      {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }

  async selectTeam(req: Request, res: Response) 
  {
    try 
    {
      const userId = req.body.userId;
      const gameId = req.params.gameId;
      const teamId = req.body.teamId;
      const game = await lobbyService.selectTeam(userId, gameId, teamId);
      res.status(HttpStatusCode.OK).json(game);
    } 
    catch (error) 
    {
      if (error instanceof HttpException) 
      {
        res.status(error.status).json({ message: error.message });
      } 
      else 
      {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }

  async leaveLobby(req: Request, res: Response) 
  {
    try 
    {
      const userId = req.body.userId;
      const gameId = req.params.gameId;
      const game = await lobbyService.leaveLobby(userId, gameId);
      res.status(HttpStatusCode.OK).json(game);
    } 
    catch (error) 
    {
      if (error instanceof HttpException) 
      {
        res.status(error.status).json({ message: error.message });
      } 
      else 
      {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }
}

export const lobbyController = new LobbyController();
