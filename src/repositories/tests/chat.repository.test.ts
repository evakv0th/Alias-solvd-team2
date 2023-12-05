import { chatRepository } from '../chat.repository'; 
import { chatsDb } from '../../couchdb.init';

jest.mock('../../couchdb.init', () => ({
  chatsDb: {
    get: jest.fn(),
    insert: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('ChatRepository', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new chat and return the id', async () => {
    const mockId = '31415';
    (chatsDb.insert as jest.Mock).mockResolvedValue({ id: mockId });

    const chatId = await chatRepository.create();

    expect(chatId).toBe(mockId);
    expect(chatsDb.insert).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should return true if a chat exists', async () => {
    const chatId = '31415';
    (chatsDb.get as jest.Mock).mockResolvedValue({ _id: chatId });

    const exists = await chatRepository.exists(chatId);

    expect(exists).toBe(true);
    expect(chatsDb.get).toHaveBeenCalledWith(chatId);
  });

  it('should return false if a chat does not exist', async () => {
    const chatId = 'non_existent_id';
    (chatsDb.get as jest.Mock).mockRejectedValue(new Error('not found'));

    const exists = await chatRepository.exists(chatId);

    expect(exists).toBe(false);
    expect(chatsDb.get).toHaveBeenCalledWith(chatId);
  });

  it('should update a chat and return the updated chat', async () => {
    const chatId = '31415';
    const messages = [{
        message: 'Test message', 
        senderId: 'user1',
        createdAt: new Date(), 
        userId: 'user1'         
      }];
    (chatsDb.get as jest.Mock).mockResolvedValue({ _id: chatId, messages: [] });
    (chatsDb.insert as jest.Mock).mockResolvedValue({ id: chatId });

    const chat = await chatRepository.update({ _id: chatId, messages });

    expect(chat).toEqual({ _id: chatId, messages });
    expect(chatsDb.get).toHaveBeenCalledWith(chatId);
    expect(chatsDb.insert).toHaveBeenCalledWith({ _id: chatId, messages });
  });

  it('should delete a chat by id', async () => {
    const chatId = '31415';
    const rev = 'rev1';

    (chatsDb.get as jest.Mock).mockResolvedValue({ _id: chatId, _rev: rev });

    await chatRepository.delete(chatId);

    expect(chatsDb.get).toHaveBeenCalledWith(chatId);
    expect(chatsDb.destroy).toHaveBeenCalledWith(chatId, rev);
  });

});
