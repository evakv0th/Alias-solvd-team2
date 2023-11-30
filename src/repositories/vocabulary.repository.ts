import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { vocabulariesDb } from '../couchdb.init';
import {
  IVocabulary,
  IVocabularyCreateSchema,
} from '../interfaces/vocabulary.interface';

class Vocabulary implements IVocabulary {
  _id: string | undefined;
  words: string[];

  constructor(vocabulary: IVocabularyCreateSchema) {
    this.words = vocabulary.words;
  }
}

<<<<<<< HEAD
export class VocabularyRepository {

=======
class VocabularyRepository {
>>>>>>> remotes/origin/dev
  async getById(id: string): Promise<Vocabulary> {
    try {
      return await vocabulariesDb.get(id);
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Vocabulary not found by id',
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
    try {
      await vocabulariesDb.insert(oldVocabulary);
      return oldVocabulary;
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Vocabulary not found by id',
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
      const doc = await vocabulariesDb.get(id);
      await vocabulariesDb.destroy(id, doc._rev);
    } catch (err) {
      console.error(err);
    }
  }
}

export const vocabularyRepository = new VocabularyRepository();
