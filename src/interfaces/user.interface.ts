export interface IUser {
  _id: string | undefined;
  username: string;
  password: string;
  createdAt: Date;
  stats: {
    roundsPlayed: number;
    wordsGuessed: number;
  };
}

export interface IUserCreateSchema {
  username: string;
  password: string;
}
