import express from 'express';
import { createLobby, joinLobby } from '../controllers/lobby.controller';

const lobbyRouter = express.Router();

lobbyRouter.post('/create', createLobby);
lobbyRouter.post('/join', joinLobby);

export default lobbyRouter;
