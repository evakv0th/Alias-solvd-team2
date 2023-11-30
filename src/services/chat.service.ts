import {chatRepository} from '../repositories/chat.repository';
import {IChat} from '../interfaces/chat.interface';
import HttpException from "../application/utils/exceptions/http-exceptions";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import {userService} from "./user.service";

class ChatService {
  async getById(id: string): Promise<IChat> {
    return chatRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return chatRepository.exists(id);
  }

  async create(): Promise<string> {
    return chatRepository.create();
  }

  async update(chat: IChat): Promise<IChat> {
    for (const message of chat.messages) {
      const userExists = await userService.exists(message.userId);
      if (!userExists) {
        throw new HttpException(HttpStatusCode.NOT_FOUND, `User ${message.userId} is not found.`);
      }
    }
    return chatRepository.update(chat);
  }

  async delete(id: string): Promise<void> {
    await chatRepository.delete(id);
  }
}

export const chatService = new ChatService();
