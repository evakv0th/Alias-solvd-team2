import { Request } from 'express';
import { IUser } from '../../interfaces/user.interface';
import { SessionData } from '../../interfaces/session.interface';
import { Session } from 'express-session';

export interface RequestWithUser extends Request {
  user: IUser;
  session: Session & Partial<SessionData>;
}

export async function storeUserInSession(
  req: RequestWithUser,
) {
  const user = req.user as IUser;
  req.session.user = user;
}
