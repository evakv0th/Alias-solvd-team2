import {
  IVocabulary,
  IVocabularyCreateSchema,
} from '../interfaces/vocabulary.interface';
import { vocabularyRepository } from '../repositories/vocabulary.repository';

class VocabularyService {
  async getById(id: string): Promise<IVocabulary> {
    return vocabularyRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return vocabularyRepository.exists(id);
  }

  async create(vocabulary: IVocabularyCreateSchema): Promise<string> {
    return vocabularyRepository.create(vocabulary);
  }

  async update(vocabulary: IVocabulary): Promise<IVocabulary> {
    return vocabularyRepository.update(vocabulary);
  }

  async delete(id: string): Promise<void> {
    await vocabularyRepository.delete(id);
  }
}

export const vocabularyService = new VocabularyService();
