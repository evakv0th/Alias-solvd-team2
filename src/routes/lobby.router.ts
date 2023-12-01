import express from 'express';
import { lobbyController } from '../controllers/lobby.controller';
import {
  validateLobbyCreateRoute,
  validateJoinLobbyRoute,
  validateSelectTeamRoute,
  validateLeaveLobbyRoute
} from '../security/requestLobbyRouteValidator';

const lobbyRouter = express.Router();

lobbyRouter.post('/create', validateLobbyCreateRoute(), lobbyController.createLobby);
lobbyRouter.post('/join/:gameId', validateJoinLobbyRoute(), lobbyController.joinLobby);
lobbyRouter.put('/selectTeam/:gameId', validateSelectTeamRoute(), lobbyController.selectTeam);
lobbyRouter.post('/leave/:gameId', validateLeaveLobbyRoute(), lobbyController.leaveLobby);

export default lobbyRouter;
