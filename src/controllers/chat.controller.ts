import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { IChat } from '../interfaces/chat.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { RequestWithUser } from '../application/middlewares/authenticateToken';

class ChatController {
  async getById(req: Request, res: Response): Promise<void> {
    const chatId: string = req.params.id;

    try {
      const chat = await chatService.getById(chatId);
      res.status(200).json(chat);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }
  async create(req: Request, res: Response): Promise<void> {
    try {
      const chatId: string = await chatService.create();
      res.status(201).json({ id: chatId });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const chatId: string = req.params.id;
    const newChat: IChat = req.body;
    newChat._id = chatId;

    try {
      const updatedChat: IChat = await chatService.update(newChat);
      res.status(200).json(updatedChat);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const chatId: string = req.params.id;

    try {
      await chatService.delete(chatId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }

  async view(req: RequestWithUser, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      if (!(await chatService.exists(id))) {
        res.status(404).send('chat  not found, please check your id');
        return;
      }

      res.render('chat', { user: req.user, chatId: req.params.id });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }
}

export const chatController = new ChatController();
