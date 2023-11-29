import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { chatsDb } from '../couchdb.init';
import { ChatMessage, IChat } from '../interfaces/chat.interface';

class Chat implements IChat {
  _id: string | undefined;
  messages: ChatMessage[];

  constructor() {
    this.messages = [];
  }
}

class ChatRepository {
  async getById(id: string): Promise<IChat> {
    try {
      return await chatsDb.get(id);
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Chat not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      await chatsDb.get(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async create(): Promise<string> {
    const createdChat = new Chat();
    const response = await chatsDb.insert(createdChat);
    return response.id;
  }

  async update(chat: IChat): Promise<IChat> {
    const oldChat = await this.getById(chat._id!);
    oldChat.messages = chat.messages;
    try {
      await chatsDb.insert(oldChat);
      return oldChat;
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Chat not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const chat = await chatsDb.get(id);
      chatsDb.destroy(id, chat._rev);
    } catch (err) {
      console.error(err);
    }
  }
}

export const chatRepository = new ChatRepository();
