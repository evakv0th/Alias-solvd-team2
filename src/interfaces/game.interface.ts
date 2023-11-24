export interface IGame {
  _id: string | undefined;
  hostId: string;
  createdAt: Date;
  teams: {
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
  goal: number;
  roundTime: number;
  vocabularyId: string;
}
