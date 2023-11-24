import { ILobby, tempLobbyArr } from '../interfaces/lobby.interface';

export function createLobby(hostId: string, lobbyName: string): ILobby {
  const newLobby: ILobby = {
    // TODO: is the additional util need?
    id: generateUniqueLobbyId(), 
    hostId,
    name: lobbyName,
    members: [hostId],
    gameStarted: false,
  };
  tempLobbyArr.push(newLobby);
  return newLobby;
}

export function joinLobby(userId: string, lobbyId: string): ILobby {
  const lobby = tempLobbyArr.find(lobby => lobby.id === lobbyId);
  if (!lobby) {
    throw new Error('Lobby not found');
  }
  lobby.members.push(userId);
  return lobby;
}
