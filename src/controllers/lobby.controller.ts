import { Request, Response } from 'express';
import { lobbyService } from '../services/lobby.service';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import HttpException from '../application/utils/exceptions/http-exceptions';

class LobbyController {
  async createLobby(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const hostId = req.body.hostId;
      const options = req.body.options;
      const gameId = await lobbyService.createLobby(hostId, options);
      res.status(HttpStatusCode.CREATED).json({ gameId });
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

  async joinLobby(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const userId = req.body.userId;
      const gameId = req.params.gameId;
      const updatedGame = await lobbyService.joinLobby(userId, gameId);
      res.status(HttpStatusCode.OK).json(updatedGame);
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

  async selectTeam(req: Request, res: Response): Promise<void> {
    try 
    {
      const userId = req.body.userId;
      const gameId = req.params.gameId;
      const teamId = req.body.teamId;
      const updatedGame = await lobbyService.selectTeam(userId, gameId, teamId);
  
      res.status(HttpStatusCode.OK).json(updatedGame);
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
  

  async leaveLobby(req: Request, res: Response): Promise<void> {
    try 
    {
      const userId = req.body.userId;
      const gameId = req.params.gameId;
      const updatedGame = await lobbyService.leaveLobby(userId, gameId);
  
      res.status(HttpStatusCode.OK).json(updatedGame);
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
