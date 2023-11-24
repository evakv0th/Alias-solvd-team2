import { ITeam } from "./team.interface";

export interface ILobby {
    _id: string | undefined;
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
    _id: 'lobby1',
    hostId: '1',
    name: 'First Lobby',
    teams: [
      {
        "_id": "teamId1",
        "hostId": "userId",
        "name": "Curious bears",
        "members": [
          "userId1",
          "userId2",
          "userId3"
        ]
      },
      {
        "_id": "teamId2",
        "hostId": "userId",
        "name": "Probabilistic SuBsPaCe",
        "members": [
          "userId4",
          "userId5",
          "userId6"
        ]
      }
    ],
    gameStarted: false,
    createdAt: new Date().toISOString(),
    maxPlayers: 10,
    isPrivate: false
  },
];
