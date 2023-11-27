import express from 'express';
import {create, getById, updateMembers,} from '../controllers/team.controller';
import {authenticateToken} from "../application/middlewares/authenticateToken";

const teamRouter = express.Router();

teamRouter.post('/', authenticateToken, create);
teamRouter.get('/:id', authenticateToken, getById);
teamRouter.put('/:id/members', authenticateToken, updateMembers);

export default teamRouter;
