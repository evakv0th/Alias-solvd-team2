import { chatRepository } from '../repositories/chat.repository';
import { IChat } from '../interfaces/chat.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

class ChatService {
  async getById(id: string): Promise<IChat> {
    try {
      return chatRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'chat not found by id!',
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return chatRepository.exists(id);
  }

  async create(): Promise<string> {
    return chatRepository.create();
  }

  async update(chat: IChat): Promise<IChat> {
    try {
      return chatRepository.update(chat);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'chat not found by id!',
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await chatRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'chat not found by id!',
      );
    }
  }
}

export const chatService = new ChatService();
