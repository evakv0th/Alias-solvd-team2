import { IUserCreateSchema, tempUserArr } from '../interfaces/user.interface';
import HttpException from '../utils/exceptions/http-exceptions';
import HttpStatusCode from '../utils/exceptions/statusCode';

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
  tempUserArr.push(newUser)
  return newUser;
}
