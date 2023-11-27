export interface IRound {
  _id: string | undefined;
  startedAt: Date;
  finishedAt: Date;
  teamId: string;
  hostId: string;
  chatId: string;
  words: IRoundWord[];
}

export interface IRoundWord {
  word: string;
  guessed: boolean | undefined;
}

export interface IRoundCreateSchema {
  teamId: string;
  hostId: string;
  chatId: string;
  finishedAt: Date;
  currentWord: string;
}
