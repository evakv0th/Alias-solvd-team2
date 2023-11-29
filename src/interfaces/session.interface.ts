export interface SessionData {
  user: UserSession
}

export interface UserSession {
  _id: string | undefined;
  username: string;
  password: string;
  createdAt: Date;
  stats: {
    roundPlayed: number;
    wordsGuessed: number;
  };
}