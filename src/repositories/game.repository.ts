import nano from 'nano';
import { gamesDb } from '../couchdb.init';
import {
  GameOptions,
  IGame,
  IGameCreateSchema,
} from '../interfaces/game.interface';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import HttpException from '../application/utils/exceptions/http-exceptions';

class Game implements IGame {
  _id: string | undefined;
  hostId: string;
  createdAt: Date;
  teams: {
    teamId: string;
    score: number;
  }[];
  currentTeam: string;
  rounds: string[];
  options: GameOptions;

  constructor(game: IGameCreateSchema) {
    this.hostId = game.hostId;
    this.createdAt = new Date();
    this.teams = game.teams.map((team) => ({
      teamId: team,
      score: 0
    }));
    // the first team undefined handle
    this.currentTeam = this.teams[0].teamId ?? '';
    this.rounds = [];
    this.options = game.options;
  }
}

class GameRepository {
  async getById(id: string): Promise<IGame> {
    try {
      return await gamesDb.get(id);
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Game not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      await gamesDb.get(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async create(game: IGameCreateSchema): Promise<string> {
    const createdGame = new Game(game);
    const response = await gamesDb.insert(createdGame);
    return response.id;
  }

  async update(game: IGame): Promise<IGame> {
    const oldGame = await this.getById(game._id!);
    oldGame.currentTeam = game.currentTeam;
    oldGame.rounds = game.rounds;
    oldGame.teams = game.teams;
    try {
      await gamesDb.insert(oldGame as nano.MaybeDocument & IGame);
      return oldGame;
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Game not found by id',
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
    await gamesDb.get(id, (err, body) => {
      if (!err) {
        gamesDb.destroy(id, body._rev);
      }
    });
  }
}

export const gameRepository = new GameRepository();
