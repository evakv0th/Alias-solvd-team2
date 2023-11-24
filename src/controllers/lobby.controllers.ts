import { Request, Response } from 'express';
import * as lobbyService from '../services/lobby.service';

export async function createLobby(req: Request, res: Response) {
  try {
    const { hostId, name } = req.body;
    const lobby = lobbyService.createLobby(hostId, name);
    res.status(201).json(lobby);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function joinLobby(req: Request, res: Response) {
  try {
    const { userId, lobbyId } = req.body;
    const lobby = lobbyService.joinLobby(userId, lobbyId);
    res.status(200).json(lobby);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
