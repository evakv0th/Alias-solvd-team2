import { IUser, IUserCreateSchema } from '../interfaces/user.interface';
import { userRepository } from '../repositories/user.repository';

class UserService {
  async getById(id: string): Promise<IUser> {
    return userRepository.getById(id);
  }
  async getByUsername(username: string): Promise<IUser> {
    return userRepository.getByUsername(username);
  }

  async exists(username: string): Promise<boolean> {
    return userRepository.exists(username);
  }

  async create(user: IUserCreateSchema): Promise<string> {
    return userRepository.create(user);
  }

  async update(user: IUser): Promise<IUser> {
    return userRepository.update(user);
  }

  async delete(id: string): Promise<void> {
    await userRepository.delete(id);
  }
}

export const userService = new UserService();
