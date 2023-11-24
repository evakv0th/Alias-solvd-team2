import { generateUniqueLobbyId } from '../application/utils/lobbyUniqueId/generateUniqueLobbyId';
import { ILobby, tempLobbyArr } from '../interfaces/lobby.interface';
import { ITeam } from '../interfaces/team.interface';

export function createLobby(hostId: string, lobbyName: string, maxPlayers: number, isPrivate: boolean): ILobby {
  const newLobby: ILobby = {
    _id: generateUniqueLobbyId(),
    hostId,
    name: lobbyName,
    teams: [],
    gameStarted: false,
    createdAt: new Date().toISOString(),
    maxPlayers,
    isPrivate,
  };
  tempLobbyArr.push(newLobby);
  return newLobby;
}

export function joinLobby(userId: string, lobbyId: string, teamId: string): ILobby {
  const lobby = tempLobbyArr.find(lobby => lobby._id === lobbyId);
  if (!lobby) {
    throw new Error('Lobby not found');
  }
  const team = lobby.teams.find(team => team._id === teamId);
  if (!team) {
    throw new Error('Team not found');
  }
  if (team.members.includes(userId)) {
    throw new Error('User already in the team');
  }
  team.members.push(userId);
  return lobby;
}


export function selectTeam(userId: string, lobbyId: string, teamId: string): ITeam {
  // Find the lobby by its ID
  const lobby = tempLobbyArr.find(lobby => lobby._id === lobbyId);
  if (!lobby) {
    throw new Error('Lobby not found');
  }

  // Find the team within the lobby
  const team = lobby.teams.find(team => team._id === teamId);
  if (!team) {
    throw new Error('Team not found');
  }

  if (team.members.includes(userId)) {
    throw new Error('User already in the team');
  }

  team.members.push(userId);
  return team;
}