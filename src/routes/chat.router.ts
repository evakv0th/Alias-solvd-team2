import express from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';

const chatRouter = express.Router();

chatRouter.get('/:id', authenticateToken, chatController.getById);
chatRouter.post('/', authenticateToken, chatController.create);
chatRouter.patch('/:id', authenticateToken, chatController.update);
chatRouter.delete('/:id', authenticateToken, chatController.delete);

chatRouter.get('/:id/view', chatController.view);

export default chatRouter;
