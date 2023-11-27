import { roundRepository } from '../repositories/round.repository';
import { IRound, IRoundCreateSchema } from '../interfaces/round.interface';
import { gameService } from './game.service';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

class RoundService {
  async getById(id: string): Promise<IRound> {
    try {
      return roundRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'Round not found by id!',
      );
    }
  }

  async getAllByGameId(gameId: string): Promise<IRound[]> {
    const game = await gameService.getById(gameId);
    const rounds = game.rounds.map((roundId) => this.getById(roundId));
    return Promise.all(rounds);
  }

  async exists(id: string): Promise<boolean> {
    return roundRepository.exists(id);
  }

  async create(round: IRoundCreateSchema): Promise<string> {
    return roundRepository.create(round);
  }

  async update(round: IRound): Promise<IRound> {
    try {
      return roundRepository.update(round);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'Round not found by id!',
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await roundRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'Round not found by id!',
      );
    }
  }
}

export const roundService = new RoundService();
