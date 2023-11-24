import express from 'express';
import { lobbyController } from '../controllers/lobby.controller';

const lobbyRouter = express.Router();

lobbyRouter.post('/create', lobbyController.createLobby);
lobbyRouter.post('/join/:gameId', lobbyController.joinLobby);
lobbyRouter.put('/selectTeam/:gameId', lobbyController.selectTeam);
lobbyRouter.post('/leave/:gameId', lobbyController.leaveLobby);

export default lobbyRouter;
