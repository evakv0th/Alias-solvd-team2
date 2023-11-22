import express from 'express';
import {
  login,
  protectedRoute,
  refresh,
  register,
} from '../controllers/auth.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.get('/login', login);
authRouter.post('/refresh', refresh);
authRouter.get('/protectedRoute', authenticateToken, protectedRoute);

export default authRouter;
