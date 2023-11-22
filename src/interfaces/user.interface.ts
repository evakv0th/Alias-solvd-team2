export interface IUser {
  id: string;
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

export const tempUserArr: (IUser | IUserCreateSchema)[] = [
  {
    id: '1',
    username: 'test',
    password: 'test',
    createdAt: new Date(),
    stats: {
      roundPlayed: 1,
      wordsGuessed: 1,
    },
  },
];
