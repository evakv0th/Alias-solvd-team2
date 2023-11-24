import { ITeam } from "./team.interface";

export interface ILobby {
    id: string;
    hostId: string;
    name: string;
    teams: ITeam[];
    gameStarted: boolean;
    createdAt: string;
    maxPlayers: number;
    isPrivate: boolean;
  }

export const tempLobbyArr: ILobby[] = [
  {
    id: 'lobby1',
    hostId: '1',
    name: 'First Lobby',
    teams: [],
    gameStarted: false,
    createdAt: new Date().toISOString(),
    maxPlayers: 10,
    isPrivate: false
  },
];
