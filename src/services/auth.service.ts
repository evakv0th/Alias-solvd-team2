import { IUser, IUserCreateSchema } from '../interfaces/user.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../application/utils/tokenForAuth/generateToken';
import { userService } from './user.service';

export async function register(
  newUser: IUserCreateSchema,
): Promise<IUserCreateSchema> {
  const { username, password } = newUser;
  
  if (!username || !password) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `Please provide username and password`,
    );
  }

  if (await userService.exists(username)) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `User with username ${username} already exists`,
    );
  }
  await userService.create(newUser);
  return newUser;
}

export async function login(credentials: IUserCreateSchema): Promise<{
  accessToken: string;
  refreshToken: string;
  _id: string | undefined;
}> {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `Please provide username and password`,
    );
  }

  const user = await userService.getByUsername(username);

  //TODO check with bcrypt
  if (!user || user.password !== password) {
    throw new HttpException(
      HttpStatusCode.UNAUTHORIZED,
      `Wrong username or password`,
    );
  }

  const accessToken = generateAccessToken(user as IUser);
  const refreshToken = generateRefreshToken(user as IUser);

  return { accessToken, refreshToken, _id: user._id };
}
