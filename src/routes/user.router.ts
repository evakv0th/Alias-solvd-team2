import express from 'express';
import { authenticateToken } from '../application/middlewares/authenticateToken';

const userRouter = express.Router();

userRouter.get('/:id', authenticateToken);
userRouter.put('./:id', authenticateToken);

export default userRouter;