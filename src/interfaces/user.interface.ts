export interface IUser {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  stats: {
    roundPlayed: number;
    wordsGuessed: number;
  };
}

export interface IUserCreateSchema {
  username: string;
  password: string;
}
