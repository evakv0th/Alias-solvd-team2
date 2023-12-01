import express from 'express';
import {create, getById, start} from '../controllers/game.controller';
import {authenticateToken} from "../application/middlewares/authenticateToken";
import { validateGameCreateRoute,
  validateGetGameRoute,
  validateGameStartRoute
} from "../security/requestGameRouteValidator"

const gameRouter = express.Router();

gameRouter.post('/', authenticateToken, validateGameCreateRoute, create);
gameRouter.get('/:id', authenticateToken, validateGetGameRoute, getById);
gameRouter.post('/:id/start', authenticateToken, validateGameStartRoute, start);

export default gameRouter;
