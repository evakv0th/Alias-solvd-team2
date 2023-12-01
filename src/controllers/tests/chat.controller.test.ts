import { Request, Response } from 'express';
import { chatService } from '../../services/chat.service';
import { chatController } from '../../controllers/chat.controller';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import { IUser } from '../../interfaces/user.interface';

jest.mock('../../services/chat.service');

interface ExtendedRequest extends Request {
    user?: IUser;
}

type MockRequest = Partial<ExtendedRequest>;

type MockResponse = Partial<Response> & {
  status: jest.Mock<any, any>;
  json: jest.Mock<any, any>;
  send: jest.Mock<any, any>;
  render: jest.Mock<any, any>;
};

const mockRequest = (params = {}, body = {}, user?: IUser): MockRequest => ({
    params,
    body,
    user,
});
  
const mockResponse = (): MockResponse => {
    const res: MockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        render: jest.fn().mockReturnThis(),
    };
    return res;
};

describe('ChatController.getById', () => {
  describe('getById', () => {
    it('should return a chat when found', async () => {
      const req = mockRequest({ id: 'chatId' });
      const res = mockResponse();

      const mockChat = { _id: 'chatId', messages: [] };
      (chatService.getById as jest.Mock).mockResolvedValue(mockChat);

      await chatController.getById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith(mockChat);
    });

    it('should handle errors when chat not found', async () => {
      const req = mockRequest({ id: 'chatId' });
      const res = mockResponse();

      (chatService.getById as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'Not found'));

      await chatController.getById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});

describe('ChatController.create', () => {
    it('should create a new chat and return its id', async () => {
      const req = mockRequest();
      const res = mockResponse();
  
      (chatService.create as jest.Mock).mockResolvedValue('newChatId');
  
      await chatController.create(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(res.json).toHaveBeenCalledWith({ id: 'newChatId' });
    });
  
    it('should handle errors during chat creation', async () => {
      const req = mockRequest();
      const res = mockResponse();
  
      (chatService.create as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error creating chat'));
  
      await chatController.create(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating chat' });
    });
});
  

describe('ChatController.create', () => {
    it('should create a new chat and return its id', async () => {
      const req = mockRequest();
      const res = mockResponse();
  
      (chatService.create as jest.Mock).mockResolvedValue('newChatId');
  
      await chatController.create(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(res.json).toHaveBeenCalledWith({ id: 'newChatId' });
    });
  
    it('should handle errors during chat creation', async () => {
      const req = mockRequest();
      const res = mockResponse();
  
      (chatService.create as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error creating chat'));
  
      await chatController.create(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating chat' });
    });
});
  
describe('ChatController.view', () => {
    it('should render the chat view if chat exists', async () => {
        const mockUser: IUser = { _id: 'userId', username: 'testUser', password: 'password', createdAt: new Date(), stats: {roundsPlayed: 0, wordsGuessed: 0}};
        const req = mockRequest({ id: 'chatId' }, {}, mockUser);
        const res = mockResponse();

        (chatService.exists as jest.Mock).mockResolvedValue(true);

        await chatController.view(req as ExtendedRequest, res as Response);

        expect(res.render).toHaveBeenCalledWith('chat', { user: req.user, chatId: 'chatId' });
    });

    it('should handle errors if chat does not exist', async () => {
        const mockUser: IUser = { _id: 'userId', username: 'testUser', password: 'password', createdAt: new Date(), stats: {roundsPlayed: 0, wordsGuessed: 0}};
        const req = mockRequest({ id: 'chatId' }, {}, mockUser);
        const res = mockResponse();

        (chatService.exists as jest.Mock).mockResolvedValue(false);

        await chatController.view(req as ExtendedRequest, res as Response);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
        expect(res.send).toHaveBeenCalledWith('chat not found, please check your id');
    });
});
