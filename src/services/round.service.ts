import {roundRepository} from "../repositories/round.repository";
import {IRound, IRoundCreateSchema} from "../interfaces/round.interface";

class RoundService {

  async getById(id: string): Promise<IRound> {
    return roundRepository.getById(id);
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