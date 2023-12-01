import { chatRepository } from '../../repositories/chat.repository';
import { userService } from '../../services/user.service';
import { ChatService } from '../chat.service';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';

jest.mock('../../repositories/chat.repository');
jest.mock('../../services/user.service');

const chatService = new ChatService();

describe('ChatService', () => {
  describe('getById', () => {
    it('should return a chat by id', async () => {
      const mockChat = { _id: 'chatId', messages: [] };
      (chatRepository.getById as jest.Mock).mockResolvedValue(mockChat);

      const result = await chatService.getById('chatId');

      expect(chatRepository.getById).toHaveBeenCalledWith('chatId');
      expect(result).toEqual(mockChat);
    });
  });

  describe('exists', () => {
    it('should check if a chat exists', async () => {
      (chatRepository.exists as jest.Mock).mockResolvedValue(true);

      const result = await chatService.exists('chatId');

      expect(chatRepository.exists).toHaveBeenCalledWith('chatId');
      expect(result).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a new chat and return its id', async () => {
      (chatRepository.create as jest.Mock).mockResolvedValue('newChatId');

      const result = await chatService.create();

      expect(chatRepository.create).toHaveBeenCalled();
      expect(result).toBe('newChatId');
    });
  });

  describe('update', () => {
    it('should update a chat if all users in messages exist', async () => {
      const mockChat = { _id: 'chatId', messages: [{ userId: 'userId', message: 'Hi', createdAt: new Date() }] };
      (chatRepository.update as jest.Mock).mockResolvedValue(mockChat);
      (userService.exists as jest.Mock).mockResolvedValue(true);

      const result = await chatService.update(mockChat);

      expect(userService.exists).toHaveBeenCalledWith('userId');
      expect(chatRepository.update).toHaveBeenCalledWith(mockChat);
      expect(result).toEqual(mockChat);
    });

    it('should throw an error if a user in messages does not exist', async () => {
      const mockChat = { _id: 'chatId', messages: [{ userId: 'nonexistentUserId', message: 'Hi', createdAt: new Date() }] };
      (userService.exists as jest.Mock).mockResolvedValue(false);

      await expect(chatService.update(mockChat)).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a chat', async () => {
      (chatRepository.delete as jest.Mock).mockResolvedValue(true);

      await chatService.delete('chatId');

      expect(chatRepository.delete).toHaveBeenCalledWith('chatId');
    });
  });
});
