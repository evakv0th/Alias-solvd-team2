import express from 'express';
import {
  getChat,
  createChat,
  updateChat,
  deleteChat,
} from '../controllers/chat.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';

const chatRouter = express.Router();

chatRouter.get('/:id', authenticateToken, getChat);
chatRouter.post('/', authenticateToken, createChat);
chatRouter.patch('/:id', authenticateToken, updateChat);
chatRouter.delete('/:id', authenticateToken, deleteChat);

export default chatRouter;
