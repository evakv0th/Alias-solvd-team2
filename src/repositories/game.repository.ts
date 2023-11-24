import {gamesDb} from "../couchdb.init";
import {GameOptions, IGame, IGameCreateSchema} from "../interfaces/game.interface";

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
    this.teams = game.teams.map(team => ({teamId: team, score: 0}));
    this.currentTeam = this.teams[0].teamId;
    this.rounds = [];
    this.options = game.options;
  }

}

class GameRepository {

  async getById(id: string): Promise<IGame> {
    return await gamesDb.get(id);
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
    await gamesDb.insert(oldGame);
    return oldGame;
  }

  async delete(id: string) {
    await gamesDb.get(id, (err, body) => {
      if (!err) {
        gamesDb.destroy(id, body._rev);
      }
    });
  }

}

export const gameRepository = new GameRepository();