import express from 'express';
import {create, getById, start} from '../controllers/game.controller';
import {authenticateToken} from "../application/middlewares/authenticateToken";

const gameRouter = express.Router();

gameRouter.post('/', authenticateToken, create);
gameRouter.get('/:id', authenticateToken, getById);
gameRouter.post('/:id/start', authenticateToken, start);

export default gameRouter;
