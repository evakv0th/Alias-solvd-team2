import {roundsDb} from "../couchdb.init";
import {IRound, IRoundCreateSchema, IRoundWord} from "../interfaces/round.interface";
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

class Round implements IRound {
  _id: string | undefined;
  startedAt: Date;
  finishedAt: Date;
  teamId: string;
  hostId: string;
  chatId: string;
  words: IRoundWord[];

  constructor(round: IRoundCreateSchema) {
    this.startedAt = new Date();
    this.finishedAt = round.finishedAt;
    this.teamId = round.teamId;
    this.hostId = round.hostId;
    this.chatId = round.chatId;
    this.words = [
      {
        word: round.currentWord
      } as IRoundWord
    ];
  }
}

class RoundRepository {
  async getById(id: string): Promise<IRound> {
    try {
      return await roundsDb.get(id);
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Round not found by id',
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
      await roundsDb.get(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async create(round: IRoundCreateSchema): Promise<string> {
    const createdRound = new Round(round);
    const response = await roundsDb.insert(createdRound);
    return response.id;
  }

  async update(round: IRound): Promise<IRound> {
    const oldRound = await this.getById(round._id!);
    oldRound.words = round.words;
    try {
      await roundsDb.insert(oldRound);
      return oldRound;
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Round not found by id',
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
      const doc = await roundsDb.get(id);
      await roundsDb.destroy(id, doc._rev);
    } catch (err) {
      console.error(err);
    }
  }
}

export const roundRepository = new RoundRepository();
