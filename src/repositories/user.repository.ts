import { IUser, IUserCreateSchema } from '../interfaces/user.interface';
import { usersDb } from '../couchdb.init';

class User implements IUser {
  _id: string | undefined;
  username: string;
  password: string;
  createdAt: Date;
  stats: {
    roundPlayed: number;
    wordsGuessed: number;
  };

  constructor(user: IUserCreateSchema) {
    this.username = user.username;
    this.password = user.password;
    this.createdAt = new Date();
    this.stats = {
      roundPlayed: 0,
      wordsGuessed: 0,
    };
  }
}

<<<<<<< HEAD
export class UserRepository {

=======
class UserRepository {
>>>>>>> origin/dev
  async getById(id: string): Promise<IUser> {
    return await usersDb.get(id);
  }

  async getByUsername(username: string): Promise<IUser> {
    const result = await usersDb.view('views', 'byUsername', {
      key: username,
      include_docs: true,
    });
    return result.rows[0].doc! as IUser;
  }

  async exists(username: string): Promise<boolean> {
    const result = await usersDb.view('views', 'byUsername', {
      key: username,
      include_docs: true,
    });
    return result.rows.length > 0;
  }

  //TODO implement BCrypt
  async create(user: IUserCreateSchema): Promise<string> {
    const createdUser = new User(user);
    const response = await usersDb.insert(createdUser);
    return response.id;
  }

  //TODO implement BCrypt
  async update(user: IUser): Promise<IUser> {
    const oldUser = await this.getById(user._id!);
    oldUser.username = user.username;
    oldUser.password = user.password;
    oldUser.stats = user.stats;
    await usersDb.insert(oldUser);
    return oldUser;
  }

  async delete(id: string) {
    await usersDb.get(id, (err, body) => {
      if (!err) {
        usersDb.destroy(id, body._rev);
      }
    });
  }
}

export const userRepository = new UserRepository();
