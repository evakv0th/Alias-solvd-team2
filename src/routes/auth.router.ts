import express from 'express';
import {
  login,
  refresh,
  register,
} from '../controllers/auth.controller';
import { 
  validateRegisterRequest,
  validateLoginRequest,
  validateRefreshRequest 
} from '../security/requestValidators'

const authRouter = express.Router();

authRouter.post('/register', validateRegisterRequest(), register);
authRouter.post('/login', validateLoginRequest(), login);
authRouter.post('/refresh', validateRefreshRequest(), refresh);

export default authRouter;
