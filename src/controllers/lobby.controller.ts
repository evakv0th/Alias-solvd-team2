import { Request, Response } from 'express';
import * as lobbyService from '../services/lobby.service';

export async function createLobby(req: Request, res: Response): Promise<Response> {
  try {
    const { hostId, name, maxPlayers, isPrivate } = req.body;
    const lobby = lobbyService.createLobby(hostId, name, maxPlayers, isPrivate);
    return res.status(201).json(lobby);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function joinLobby(req: Request, res: Response): Promise<Response> {
  try {
    const { userId, lobbyId, teamId } = req.body;
    const lobby = lobbyService.joinLobby(userId, lobbyId, teamId);
    return res.status(200).json(lobby);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function selectTeam(req: Request, res: Response): Promise<Response> {
  try {
    const { userId, lobbyId, teamId } = req.body;
    const team = lobbyService.selectTeam(userId, lobbyId, teamId);
    return res.status(200).json(team);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}