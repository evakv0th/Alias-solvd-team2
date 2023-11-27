import express from 'express';
import { userController } from '../controllers/users.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';

const userRouter = express.Router();

userRouter.get('/:id', authenticateToken, userController.getById);
userRouter.post('/', authenticateToken, userController.create);
userRouter.patch('/:id', authenticateToken, userController.update);
userRouter.delete('/:id', authenticateToken, userController.delete);

export default userRouter;
