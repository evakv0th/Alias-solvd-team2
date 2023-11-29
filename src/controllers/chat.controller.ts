import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { IChat } from '../interfaces/chat.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { RequestWithUser } from '../application/middlewares/authenticateToken';

export async function getChat(req: Request, res: Response): Promise<void> {
  const chatId: string = req.params.id;

  try {
    const chat = await chatService.getById(chatId);
    res.status(HttpStatusCode.OK).json(chat);
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

export async function createChat(req: Request, res: Response): Promise<void> {
  try {
    const chatId: string = await chatService.create();
    res.status(HttpStatusCode.CREATED).json({ id: chatId });
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

export async function updateChat(req: Request, res: Response): Promise<void> {
  const chatId: string = req.params.id;
  const newChat: IChat = req.body;
  newChat._id = chatId;

  try {
    const updatedChat: IChat = await chatService.update(newChat);
    res.status(HttpStatusCode.OK).json(updatedChat);
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

export async function deleteChat(req: Request, res: Response): Promise<void> {
  const chatId: string = req.params.id;

  try {
    await chatService.delete(chatId);
    res.status(HttpStatusCode.NO_CONTENT).send();
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

export async function viewChat(
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  const id = req.params.id;

  try {
    if (!(await chatService.exists(id))) {
      res.status(HttpStatusCode.NOT_FOUND).send('chat  not found, please check your id');
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
