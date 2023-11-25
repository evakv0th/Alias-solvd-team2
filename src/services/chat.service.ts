import { chatRepository } from '../repositories/chat.repository';
import { IChat } from '../interfaces/chat.interface';

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
    return chatRepository.update(chat);
  }

  async delete(id: string) {
    await chatRepository.delete(id);
  }
}

export const chatService = new ChatService();
