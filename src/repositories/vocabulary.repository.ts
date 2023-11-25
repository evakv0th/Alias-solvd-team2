import {vocabulariesDb} from "../couchdb.init";
import {IVocabulary, IVocabularyCreateSchema} from "../interfaces/vocabulary.interface";

class Vocabulary implements IVocabulary {

  _id: string | undefined;
  words: string[];

  constructor(vocabulary: IVocabularyCreateSchema) {
    this.words = vocabulary.words;
  }

}

export class VocabularyRepository {

  async getById(id: string): Promise<Vocabulary> {
    return await vocabulariesDb.get(id);
  }

  async exists(id: string): Promise<boolean> {
    try {
      await vocabulariesDb.get(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async create(vocabulary: IVocabularyCreateSchema): Promise<string> {
    const createdVocabulary = new Vocabulary(vocabulary);
    const response = await vocabulariesDb.insert(createdVocabulary);
    return response.id;
  }

  async update(vocabulary: IVocabulary): Promise<IVocabulary> {
    const oldVocabulary = await this.getById(vocabulary._id!);
    oldVocabulary.words = vocabulary.words;
    await vocabulariesDb.insert(oldVocabulary);
    return oldVocabulary;
  }

  async delete(id: string) {
    await vocabulariesDb.get(id, (err, body) => {
      if (!err) {
        vocabulariesDb.destroy(id, body._rev);
      }
    });
  }

}

export const vocabularyRepository = new VocabularyRepository();