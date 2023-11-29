import {roundsDb} from "../couchdb.init";
import {IRound, IRoundCreateSchema, IRoundWord} from "../interfaces/round.interface";

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
    this.finishedAt = round.finishedAt
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
    return await roundsDb.get(id);
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
    await roundsDb.insert(oldRound);
    return oldRound;
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