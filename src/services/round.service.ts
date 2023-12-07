import { roundRepository } from '../repositories/round.repository';
import { IRound, IRoundCreateSchema } from '../interfaces/round.interface';
import { gameService } from './game.service';
import { userService } from './user.service';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { teamService } from './team.service';
import { chatService } from './chat.service';

class RoundService {
  async getById(id: string): Promise<IRound> {
    return roundRepository.getById(id);
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
    const hostExists = await userService.exists(round.hostId);
    if (!hostExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Host of round is not found.');
    }
    const teamExists = await teamService.exists(round.teamId);
    if (!teamExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Team of round is not found.');
    }
    const chatExists = await chatService.exists(round.chatId);
    if (!chatExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Chat of round is not found.');
    }
    return roundRepository.create(round);
  }

  async update(round: IRound): Promise<IRound> {
    return roundRepository.update(round);
  }

  async delete(id: string): Promise<void> {
    await roundRepository.delete(id);
  }
}

export const roundService = new RoundService();
