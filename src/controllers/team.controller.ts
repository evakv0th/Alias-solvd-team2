import {Response} from 'express';
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
    hostId: req.user!._id
  } as ITeamCreateSchema;
  const id = await teamService.create(team);
  return res
    .status(HttpStatusCode.CREATED)
    .json(await teamService.getById(id));
}

export async function getById(
  req: RequestWithUser,
  res: Response,
): Promise<Response | void> {
  const id: string = req.params.id;
  const team = await teamService.getById(id);
  return res
    .status(HttpStatusCode.OK)
    .json(team);
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
    return res
      .status(HttpStatusCode.OK);
  } else {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json(new HttpException(HttpStatusCode.UNAUTHORIZED, "Only team host can update team members."));
  }
}

export async function addMemberByName(
  req:RequestWithUser,
  res:Response,
): Promise<Response | void> {

  const id: string = req.params.id;
  const username: string = req.params.username;

  const user = await userService.getByUsername(username);
  const team = await teamService.getById(id);
  let userId: string = '';
  
  if (!user) {
    return res
    .status(HttpStatusCode.NOT_FOUND)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "User not found"));
  }

  if (!team) {
    return res.status(HttpStatusCode.NOT_FOUND)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "Team not found"));
  }
  if (!user._id || typeof(user._id === "undefined")) {
    return res.status(HttpStatusCode.NOT_FOUND)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "User ID is undefined"));
  }

  userId = userId;

  if (!team.members.includes(userId)) {
    team.members.push(userId)
    await teamService.update(team)
      return res
    .status(HttpStatusCode.OK);
  } else {
    return res.status(HttpStatusCode.BAD_REQUEST)
    .json(new HttpException(HttpStatusCode.NOT_FOUND, "User is already exists"));
  }

}
