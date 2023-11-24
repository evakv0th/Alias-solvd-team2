import {chatsDb} from "../couchdb.init";
import {ChatMessage, IChat} from "../interfaces/chat.interface";

class Chat implements IChat {

  _id: string | undefined;
  messages: ChatMessage[]

  constructor() {
    this.messages = [];
  }

}

class ChatRepository {

  async getById(id: string): Promise<IChat> {
    return await chatsDb.get(id);
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
    await chatsDb.insert(oldChat);
    return oldChat;
  }

  async delete(id: string) {
    await chatsDb.get(id, (err, body) => {
      if (!err) {
        chatsDb.destroy(id, body._rev);
      }
    });
  }

}

export const chatRepository = new ChatRepository();