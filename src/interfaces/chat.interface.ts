export interface IChat {
  _id: string | undefined;
  messages: ChatMessage[];
}

export interface ChatMessage {
  createdAt: Date;
  userId: string;
  message: string;
}
