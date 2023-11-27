import {roundRepository} from "../repositories/round.repository";
import {IRound, IRoundCreateSchema} from "../interfaces/round.interface";
import {gameService} from "./game.service";

class RoundService {

  async getById(id: string): Promise<IRound> {
    return roundRepository.getById(id);
  }

  async getAllByGameId(gameId: string): Promise<IRound[]> {
    const game = await gameService.getById(gameId);
    const rounds = game.rounds.map(roundId => this.getById(roundId));
    return Promise.all(rounds);
  }

  async exists(id: string): Promise<boolean> {
    return roundRepository.exists(id);
  }

  async create(round: IRoundCreateSchema): Promise<string> {
    return roundRepository.create(round);
  }

  async update(round: IRound): Promise<IRound> {
    return roundRepository.update(round);
  }

  async delete(id: string) {
    await roundRepository.delete(id);
  }

}

export const roundService = new RoundService();