import express from 'express';
import {
  login,
  refresh,
  register,
} from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);

export default authRouter;
