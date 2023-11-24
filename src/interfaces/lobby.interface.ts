export interface ILobby {
    id: string;
    hostId: string;
    name: string;
    members: string[];
    gameStarted: boolean;
  }

export const tempLobbyArr: ILobby[] = [];
