export interface IGame {
  _id: string | undefined;
  hostId: string;
  createdAt: Date | undefined;
  teams: {
    //TODO remove members here
    members: string[];
    teamId: string;
    score: number;
  }[];
  currentTeam: string;
  rounds: string[];
  options: GameOptions;
}

export interface IGameCreateSchema {
  hostId: string;
  teams: string[];
  options: GameOptions;
}

export interface GameOptions {
  //TODO remove maxPlayersPerTeam
  maxPlayersPerTeam: any;
  goal: number;
  roundTime: number;
  vocabularyId: string;
}
