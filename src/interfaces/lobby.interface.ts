export interface ILobby {
    id: string;
    hostId: string;
    name: string;
    members: string[];
    gameStarted: boolean;
    createdAt: string;
  }

export const tempLobbyArr: ILobby[] = [];
