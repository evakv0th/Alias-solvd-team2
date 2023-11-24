import express from 'express';
import { createLobby, joinLobby } from '../controllers/lobby.controller';

const router = express.Router();

router.post('/create', createLobby);
router.post('/join', joinLobby);

export default router;
