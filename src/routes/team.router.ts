import express from 'express';
import {create, getById, updateMembers, addMemberByName} from '../controllers/team.controller';
import {authenticateToken} from "../application/middlewares/authenticateToken";
import {
  validateTeamCreateRoute,
  validateGetTeamRoute,
  validateUpdateTeamRoute,
  validateAddMembereByNameRoute
} from "../security/requestTeamRourValidator"

const teamRouter = express.Router();

teamRouter.post('/', validateTeamCreateRoute(), authenticateToken, create);
teamRouter.get('/:id', validateGetTeamRoute(), authenticateToken, getById);
teamRouter.put('/:id/members', validateUpdateTeamRoute(), authenticateToken, updateMembers);
teamRouter.put('/:id/members/:username', validateAddMembereByNameRoute(), authenticateToken, addMemberByName);

export default teamRouter;
