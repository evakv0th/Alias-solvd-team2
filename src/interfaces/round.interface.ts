export interface IRound {
  _id: string | undefined;
  startedAt: Date;
  finishedAt: Date;
  teamId: string;
  hostId: string;
  chatId: string;
  words: string[];
}

export interface IRoundCreateSchema {
  teamId: string;
  hostId: string;
  chatId: string;
}
