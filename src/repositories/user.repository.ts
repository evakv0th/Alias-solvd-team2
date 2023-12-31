import {IUser, IUserCreateSchema} from '../interfaces/user.interface';
import {usersDb} from '../couchdb.init';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import bcrypt from 'bcrypt';
import util from "util";

class User implements IUser {

  _id: string | undefined;
  username: string;
  password: string;
  createdAt: Date;
  stats: {
    roundsPlayed: number;
    wordsGuessed: number;
  };

  constructor(user: IUserCreateSchema) {
    this.username = user.username;
    this.password = user.password;
    this.createdAt = new Date();
    this.stats = {
      roundsPlayed: 0,
      wordsGuessed: 0,
    };
  }

}

export class UserRepository {

  async getById(id: string): Promise<IUser> {
    try {
      return await usersDb.get(id);
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'User not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async getByUsername(username: string): Promise<IUser> {
    const result = await usersDb.view('views', 'byUsername', {
      key: username,
      include_docs: true,
    });
    return result.rows[0].doc! as IUser;
  }

  async exists(id: string): Promise<boolean> {
    try {
      await usersDb.get(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    const result = await usersDb.view('views', 'byUsername', {
      key: username,
      include_docs: true,
    });
    return result.rows.length > 0;
  }

  async create(user: IUserCreateSchema): Promise<string> {
    const createdUser = new User(user);
    createdUser.password = await util.promisify(bcrypt.hash)(createdUser.password, 10);
    const response = await usersDb.insert(createdUser);
    return response.id;
  }

  async update(user: IUser): Promise<IUser> {
    const oldUser = await this.getById(user._id!);
    oldUser.username = user.username;
    oldUser.password = await util.promisify(bcrypt.hash)(user.password, 10);
    oldUser.stats = user.stats;
    try {
      await usersDb.insert(oldUser);
      return oldUser;
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'User not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const doc = await usersDb.get(id);
      await usersDb.destroy(id, doc._rev);
    } catch (err) {
      console.error(err);
    }
  }

}

export const userRepository = new UserRepository();
