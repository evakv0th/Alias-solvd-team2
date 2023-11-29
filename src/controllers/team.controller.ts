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
  const team = {
    name: req.body.name,
    hostId: req.user!._id,
  } as ITeamCreateSchema;
  const id = await teamService.create(team);
  return res.status(HttpStatusCode.CREATED).json(await teamService.getById(id));
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
  req:RequestWithUser,
  res:Response,
): Promise<Response | void> {

  const id: string = req.params.id;
  const userToAdd: string = req.params.username;

  const user = await userService.getByUsername(userToAdd);
  const team = await teamService.getById(id);

  if (!user) {
    return res
    .status(HttpStatusCode.NOT_FOUND)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "User not found"));
  }

  if (!team) {
    return res.status(HttpStatusCode.NOT_FOUND)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "Team not found"));
  }

  if (!team.members.includes(userToAdd)) {
    team.members.push(userToAdd)
    await teamService.update(team)
      return res
    .status(HttpStatusCode.OK);
  } else {
    return res.status(HttpStatusCode.BAD_REQUEST)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "User is already exists"));
  }

}
