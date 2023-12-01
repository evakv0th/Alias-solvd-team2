import express from 'express';
import { userController } from '../controllers/users.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';
import {
  validateGetUserRoute,
  validatePostUserRoute,
  validatePatchUserRoute,
  validateDeliteUserRoute
} from '../security/requestUserRouteValidator';

const userRouter = express.Router();

userRouter.get('/:id', authenticateToken, validateGetUserRoute, userController.getById);
userRouter.post('/', authenticateToken, validatePostUserRoute, userController.create);
userRouter.patch('/:id', authenticateToken, validatePatchUserRoute, userController.update);
userRouter.delete('/:id', authenticateToken, validateDeliteUserRoute, userController.delete);

export default userRouter;

