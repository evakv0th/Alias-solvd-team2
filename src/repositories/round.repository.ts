import {roundsDb} from "../couchdb.init";
import {IRound, IRoundCreateSchema} from "../interfaces/round.interface";

class Round implements IRound {

  _id: string | undefined;
  startedAt: Date;
  finishedAt: Date;
  teamId: string;
  hostId: string;
  chatId: string;
  words: string[];

  constructor(round: IRoundCreateSchema) {
    this.startedAt = new Date();
    this.teamId = round.teamId;
    this.hostId = round.hostId;
    this.chatId = round.chatId;
    this.words = [];
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
    oldRound.finishedAt = round.finishedAt;
    oldRound.words = round.words;
    await roundsDb.insert(oldRound);
    return oldRound;
  }

  async delete(id: string) {
    await roundsDb.get(id, (err, body) => {
      if (!err) {
        roundsDb.destroy(id, body._rev);
      }
    });
  }

}

export const roundRepository = new RoundRepository();