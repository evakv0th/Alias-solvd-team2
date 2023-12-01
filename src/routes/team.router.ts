import express from 'express';
import {create, getById, updateMembers, addMemberByName} from '../controllers/team.controller';
import {authenticateToken} from "../application/middlewares/authenticateToken";
import {
  validateTeamCreateRoute,
  validateGetTeamRoute,
  validateUpdateTeamRoute,
  validateAddMembereByNameRoute
} from "../security/requestTeamRouteValidator"

const teamRouter = express.Router();

teamRouter.post('/', authenticateToken, validateTeamCreateRoute, create);
teamRouter.get('/:id', authenticateToken, validateGetTeamRoute, getById);
teamRouter.put('/:id/members', authenticateToken, validateUpdateTeamRoute, updateMembers);
teamRouter.put('/:id/members/:username', authenticateToken, validateAddMembereByNameRoute, addMemberByName);

export default teamRouter;
