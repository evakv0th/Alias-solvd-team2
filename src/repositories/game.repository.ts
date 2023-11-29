import {gamesDb} from "../couchdb.init";
import {GameOptions, IGame, IGameCreateSchema} from "../interfaces/game.interface";

class Game implements IGame {

  _id: string | undefined;
  hostId: string;
  createdAt: Date | undefined;
  teams: {
    teamId: string;
    score: number;
    members: string[];
  }[];
  currentTeam: string;
  rounds: string[];
  options: GameOptions;

  constructor(game: IGameCreateSchema) {
    this.hostId = game.hostId;
    this.teams = game.teams.map(team => ({teamId: team, score: 0, members: []}));
    // the first team undefined handle
    this.currentTeam = this.teams[0].teamId ?? ''; 
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

  async start(id: string): Promise<void> {
    const game = await this.getById(id);
    game.createdAt = new Date();
    await gamesDb.insert(game);
  }

  async update(game: IGame): Promise<IGame> {
    const oldGame = await this.getById(game._id!);
    oldGame.currentTeam = game.currentTeam;
    oldGame.rounds = game.rounds;
    oldGame.teams = game.teams;
    await gamesDb.insert(oldGame);
    return oldGame;
  }

  async delete(id: string): Promise<void> {
    try {
      const doc = await gamesDb.get(id);
      await gamesDb.destroy(id, doc._rev);
    } catch (err) {
      console.error(err);
    }
  }

}

export const gameRepository = new GameRepository();