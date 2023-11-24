import {gameRepository} from "../repositories/game.repository";
import {IGame, IGameCreateSchema} from "../interfaces/game.interface";

class GameService {

  async getById(id: string): Promise<IGame> {
    return gameRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return gameRepository.exists(id);
  }

  async create(game: IGameCreateSchema): Promise<string> {
    return gameRepository.create(game);
  }

  async update(game: IGame): Promise<IGame> {
    return gameRepository.update(game);
  }

  async delete(id: string) {
    await gameRepository.delete(id);
  }

}

export const gameService = new GameService();