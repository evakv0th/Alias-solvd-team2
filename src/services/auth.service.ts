import {
  IUser,
  IUserCreateSchema,
  tempUserArr,
} from '../interfaces/user.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../application/utils/tokenForAuth/generateToken';

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

  if (tempUserArr.find((user) => user.username === username)) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `User with username ${username} already exists`,
    );
  }
  tempUserArr.push(newUser);
  return newUser;
}

export async function login(
  credentials: IUserCreateSchema,
): Promise<{ accessToken: string; refreshToken: string }> {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      `Please provide username and password`,
    );
  }
  const user = tempUserArr.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    throw new HttpException(
      HttpStatusCode.UNAUTHORIZED,
      `Wrong username or password`,
    );
  }

  const accessToken = generateAccessToken(user as IUser);
  const refreshToken = generateRefreshToken(user as IUser);

  return { accessToken, refreshToken };
}
