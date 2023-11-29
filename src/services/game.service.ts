import { gameRepository } from '../repositories/game.repository';
import { IGame, IGameCreateSchema } from '../interfaces/game.interface';
import { vocabularyService } from './vocabulary.service';
import { roundService } from './round.service';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import HttpException from '../application/utils/exceptions/http-exceptions';

class GameService {
  async getById(id: string): Promise<IGame> {
    try {
      return gameRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'game not found by id!',
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return gameRepository.exists(id);
  }

  async create(game: IGameCreateSchema): Promise<string> {
    return gameRepository.create(game);
  }

  async update(game: IGame): Promise<IGame> {
    try {
      return gameRepository.update(game);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'game not found by id!',
      );
    }
  }
  async delete(id: string): Promise<void> {
    await gameRepository.delete(id);
  }

  async getRandomWord(id: string): Promise<string> {
    const game = await this.getById(id);
    const vocabulary = await vocabularyService.getById(
      game.options.vocabularyId,
    );
    let word;
    do {
      word =
        vocabulary.words[Math.floor(Math.random() * vocabulary.words.length)];
    } while (await this.wordWasUsedInGame(word, game._id!));
    return word;
  }

  private async wordWasUsedInGame(
    word: string,
    gameId: string,
  ): Promise<boolean> {
    const rounds = await roundService.getAllByGameId(gameId);
    return rounds.some((round) => round.words.includes(word));
  }
}

export const gameService = new GameService();
