import express from 'express';
import { createLobby, joinLobby, selectTeam } from '../controllers/lobby.controller';

const lobbyRouter = express.Router();

lobbyRouter.post('/create', createLobby);
lobbyRouter.post('/join', joinLobby);
lobbyRouter.post('/team/select', selectTeam );

export default lobbyRouter;
