import {IUser, IUserCreateSchema} from '../interfaces/user.interface';
import {userRepository} from '../repositories/user.repository';

class UserService {
  async getById(id: string): Promise<IUser> {
    return userRepository.getById(id);
  }

  async getByUsername(username: string): Promise<IUser> {
    return userRepository.getByUsername(username);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return userRepository.existsByUsername(username);
  }

  async exists(id: string): Promise<boolean> {
    return userRepository.exists(id);
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

  async incrementRoundsPlayed(id: string): Promise<void> {
    const user = await this.getById(id);
    user.stats.roundsPlayed += 1;
    await userRepository.update(user);
  }
}

export const userService = new UserService();
