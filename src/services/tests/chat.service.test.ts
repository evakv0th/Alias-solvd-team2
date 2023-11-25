import { chatService } from '../chat.service';
import { chatRepository } from '../../repositories/chat.repository';
import { IChat } from '../../interfaces/chat.interface';

jest.mock('../../repositories/chat.repository', () => ({
    chatRepository: {
        getById: jest.fn(),
        exists: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
}));

describe('Chat Service', () => {
  const mockChatId = 'chat123';
  const mockChat: IChat = {
    _id: mockChatId,
    messages: [{
      createdAt: new Date(),
      userId: 'user123',
      message: 'Hello world',
    }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should retrieve a chat by ID', async () => {
      (chatRepository.getById as jest.Mock).mockResolvedValue(mockChat);
      
      const chat = await chatService.getById(mockChatId);
      
      expect(chatRepository.getById).toHaveBeenCalledWith(mockChatId);
      expect(chat).toEqual(mockChat);
    });
  });

  describe('exists', () => {
    it('should check if a chat exists by ID', async () => {
      (chatRepository.exists as jest.Mock).mockResolvedValue(true);
      
      const exists = await chatService.exists(mockChatId);
      
      expect(chatRepository.exists).toHaveBeenCalledWith(mockChatId);
      expect(exists).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a chat', async () => {
      (chatRepository.create as jest.Mock).mockResolvedValue(mockChatId);
      
      const chatId = await chatService.create();
      
      expect(chatRepository.create).toHaveBeenCalled();
      expect(chatId).toBe(mockChatId);
    });
  });

  describe('update', () => {
    it('should update a chat', async () => {
      const updatedMessages = [...mockChat.messages, {
        createdAt: new Date(),
        userId: 'user456',
        message: 'Goodbye world',
      }];
      (chatRepository.update as jest.Mock).mockResolvedValue({ ...mockChat, messages: updatedMessages });
      
      const updatedChat = await chatService.update({ ...mockChat, messages: updatedMessages });
      
      expect(chatRepository.update).toHaveBeenCalledWith({ ...mockChat, messages: updatedMessages });
      expect(updatedChat.messages).toEqual(updatedMessages);
    });
  });

  describe('delete', () => {
    it('should delete a chat by ID', async () => {
      (chatRepository.delete as jest.Mock).mockResolvedValue(undefined);
      
      await chatService.delete(mockChatId);
      
      expect(chatRepository.delete).toHaveBeenCalledWith(mockChatId);
    });
  });
});
