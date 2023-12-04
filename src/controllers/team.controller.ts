import { Response } from 'express';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import {ITeamCreateSchema} from "../interfaces/team.interface";
import {RequestWithUser} from "../application/middlewares/authenticateToken";
import {teamService} from "../services/team.service";
import { userService } from '../services/user.service';
import HttpException from "../application/utils/exceptions/http-exceptions";

export async function create(
  req: RequestWithUser,
  res: Response,
): Promise<Response | void> {
  try{
    if (!req.body.name) {
      return res.status(HttpStatusCode.BAD_REQUEST)
        .json({ error: 'Team name is required' });
    }
    
    if (!req.user || !req.user._id) {
      return res.status(HttpStatusCode.BAD_REQUEST)
        .json({ error: 'Host ID is required' });
    }
    
    const team: ITeamCreateSchema = {
      name: req.body.name,
      hostId: req.user._id,
    };

    const id = await teamService.create(team);
    const newTeam = await teamService.getById(id);

    return res.status(HttpStatusCode.CREATED).json(newTeam);
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.status).json({ error: error.message });
    } else {
      console.error('Server error during team creation:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
      });
    }
  }
}

export async function getById(
  req: RequestWithUser,
  res: Response,
): Promise<Response | void> {
  try {
    const id: string = req.params.id;
    const team = await teamService.getById(id);
    return res.status(HttpStatusCode.OK).json(team);
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: 'Internal Server Error',
      });
    }
  }
}

export async function updateMembers(
  req: RequestWithUser,
  res: Response,
): Promise<Response | void> {
  const id: string = req.params.id;
  const user = req.user;
  const members = req.body;
  const team = await teamService.getById(id);
  if (team.hostId === user?._id) {
    team.members = members;
    await teamService.update(team);
    return res.status(HttpStatusCode.OK);
  } else {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(
        new HttpException(
          HttpStatusCode.UNAUTHORIZED,
          'Only team host can update team members.',
        ),
      );
  }
}

export async function addMemberByName(
  req: RequestWithUser,
  res: Response
): Promise<Response | void> {
  const teamId = req.params.id;
  const username = req.params.username;

  if (typeof teamId !== 'string' || typeof username !== 'string') 
  {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid team ID or username' });
  }

  try 
  {
    const user = await userService.getByUsername(username);
    if (!user || !user._id) 
    {
      return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'User not found' });
    }

    const team = await teamService.getById(teamId);
    if (!team) 
    {
      return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Team not found' });
    }

    if (team.members.includes(user._id)) 
    {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'User already in the team' });
    }

    team.members.push(user._id);
    await teamService.update(team);
    return res.status(HttpStatusCode.OK).json(team);
  } 
  catch (error) 
  {
    console.error('Error in addMemberByName:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
}

