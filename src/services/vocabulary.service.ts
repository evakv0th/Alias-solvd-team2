import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import {
  IVocabulary,
  IVocabularyCreateSchema,
} from '../interfaces/vocabulary.interface';
import { vocabularyRepository } from '../repositories/vocabulary.repository';

class VocabularyService {
  async getById(id: string): Promise<IVocabulary> {
    try {
      return vocabularyRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'vocabulary not found by id!',
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return vocabularyRepository.exists(id);
  }

  async create(vocabulary: IVocabularyCreateSchema): Promise<string> {
    return vocabularyRepository.create(vocabulary);
  }

  async update(vocabulary: IVocabulary): Promise<IVocabulary> {
    try {
      return vocabularyRepository.update(vocabulary);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'vocabulary not found by id!',
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await vocabularyRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'vocabulary not found by id!',
      );
    }
  }
}

export const vocabularyService = new VocabularyService();
