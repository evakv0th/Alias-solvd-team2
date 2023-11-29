import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { IUser, IUserCreateSchema } from '../interfaces/user.interface';
import { userRepository } from '../repositories/user.repository';

class UserService {
  async getById(id: string): Promise<IUser> {
    try {
      return userRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'user not found by id!',
      );
    }
  }
  async getByUsername(username: string): Promise<IUser> {
    try {
      return userRepository.getByUsername(username);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'user not found by username',
      );
    }
  }

  async exists(username: string): Promise<boolean> {
    return userRepository.exists(username);
  }

  async create(user: IUserCreateSchema): Promise<string> {
    return userRepository.create(user);
  }

  async update(user: IUser): Promise<IUser> {
    try {
      return userRepository.update(user);
    } catch (error) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'user not found');
    }
  }

  async delete(id: string): Promise<void> {
    await userRepository.delete(id);
  }
}

export const userService = new UserService();
