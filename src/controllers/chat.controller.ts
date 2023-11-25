import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { IChat } from '../interfaces/chat.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

export async function getChat(req: Request, res: Response): Promise<void> {
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

export async function createChat(req: Request, res: Response): Promise<void> {
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

export async function updateChat(req: Request, res: Response): Promise<void> {
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

export async function deleteChat(req: Request, res: Response): Promise<void> {
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
