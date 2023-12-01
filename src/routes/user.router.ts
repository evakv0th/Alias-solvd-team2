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

userRouter.get('/:id', validateGetUserRoute(), authenticateToken, userController.getById);
userRouter.post('/', validatePostUserRoute(), authenticateToken, userController.create);
userRouter.patch('/:id', validatePatchUserRoute(), authenticateToken, userController.update);
userRouter.delete('/:id', validateDeliteUserRoute(), authenticateToken, userController.delete);

export default userRouter;

