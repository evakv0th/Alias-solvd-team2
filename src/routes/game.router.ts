import express from 'express';
import {create, getById, start} from '../controllers/game.controller';
import {authenticateToken} from "../application/middlewares/authenticateToken";
import { validateGameCreateRoute,
  validateGetGameRoute,
  validateGameStartRoute
} from "../security/requestGameRouteValidator"

const gameRouter = express.Router();

gameRouter.post('/', validateGameCreateRoute(), authenticateToken, create);
gameRouter.get('/:id', validateGetGameRoute(), authenticateToken, getById);
gameRouter.post('/:id/start', validateGameStartRoute(), authenticateToken, start);

export default gameRouter;
