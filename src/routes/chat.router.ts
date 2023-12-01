import express from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';
import { 
  validateGetChatRoute,
  validateDeleteChatRoute,
  validateUpdateChatRoute,
  validateViewChatRoute
} from '../security/requestChatRouteValidator'

const chatRouter = express.Router();

chatRouter.get('/:id', validateGetChatRoute(), authenticateToken, chatController.getById);
chatRouter.post('/', authenticateToken, chatController.create);
chatRouter.patch('/:id', validateUpdateChatRoute(), authenticateToken, chatController.update);
chatRouter.delete('/:id', validateDeleteChatRoute(), authenticateToken, chatController.delete);

chatRouter.get('/:id/view', validateViewChatRoute(), chatController.view);

export default chatRouter;
