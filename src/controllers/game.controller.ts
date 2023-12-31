import {Response} from 'express';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import {RequestWithUser} from '../application/middlewares/authenticateToken';
import {IGameCreateSchema} from '../interfaces/game.interface';
import {gameService} from '../services/game.service';
import HttpException from '../application/utils/exceptions/http-exceptions';

export async function create(req: RequestWithUser, res: Response): Promise<Response | void> {
  const game = {
    teams: req.body.teams,
    hostId: req.user!._id,
    options: req.body.options,
  } as IGameCreateSchema;
  const id = await gameService.create(game);
  return res.status(HttpStatusCode.CREATED)
    .json(await gameService.getById(id));
}

export async function getById(req: RequestWithUser, res: Response): Promise<Response | void> {
  const id: string = req.params.id;
  const user = req.user;
  const hasAccess = await gameService.hasAccess(id, user!._id!);
  if(!hasAccess) {
    res.status(HttpStatusCode.FORBIDDEN)
      .json(new HttpException(HttpStatusCode.FORBIDDEN, 'You do not have access to game.'));
  }
  const game = await gameService.getById(id);
  return res.status(HttpStatusCode.OK).json(game);
}

export async function start(req: RequestWithUser, res: Response): Promise<Response | void> {
  const id: string = req.params.id;
  const user = req.user;
  const game = await gameService.getById(id);
  if (game.hostId === user?._id) {
    const chatId = await gameService.start(id);
    return res
      .send(`Link to chat: http://localhost:3000/api/v1/chats/${chatId}/view/${user.username}`)
      .status(HttpStatusCode.OK);
  } else {
    return res.status(HttpStatusCode.UNAUTHORIZED)
      .json(new HttpException(HttpStatusCode.UNAUTHORIZED, 'Only game host can start game.'));
  }
}
