export interface ILobby {
    id: string;
    hostId: string;
    name: string;
    members: string[];
    gameStarted: boolean;
    createdAt: string;
  }

export const tempLobbyArr: ILobby[] = [
  {
    id: 'lobby1',
    hostId: '1',
    name: 'First Lobby',
    members: ['1'],
    gameStarted: false,
    createdAt: new Date().toISOString()
  },
];
