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

chatRouter.get('/:id', authenticateToken, validateGetChatRoute, chatController.getById);
chatRouter.post('/', authenticateToken, chatController.create);
chatRouter.patch('/:id', authenticateToken, validateUpdateChatRoute, chatController.update);
chatRouter.delete('/:id', authenticateToken, validateDeleteChatRoute, chatController.delete);

chatRouter.get('/:id/view/:userName', validateViewChatRoute, chatController.view);


export default chatRouter;
