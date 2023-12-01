import { VocabularyRepository } from '../vocabulary.repository';

import { vocabulariesDb } from '../../couchdb.init';
import HttpException from '../../application/utils/exceptions/http-exceptions';

jest.mock('../../couchdb.init', () => ({
  vocabulariesDb: {
    get: jest.fn(),
    insert: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('VocabularyRepository', () => {
  let vocabularyRepository: VocabularyRepository;
  const mockVocabulary = {
    _id: 'vocab123',
    words: ['word1', 'word2', 'word3'],
  };

  beforeEach(() => {
    vocabularyRepository = new VocabularyRepository();
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a vocabulary when found', async () => {
      (vocabulariesDb.get as jest.Mock).mockResolvedValue(mockVocabulary);

      const result = await vocabularyRepository.getById('vocab123');

      expect(vocabulariesDb.get).toHaveBeenCalledWith('vocab123');
      expect(result).toEqual(mockVocabulary);
    });

    it('should throw an error if vocabulary is not found', async () => {
      (vocabulariesDb.get as jest.Mock).mockRejectedValue({ statusCode: 404 });

      await expect(vocabularyRepository.getById('nonexistent')).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('exists', () => {
    it('should return true if vocabulary exists', async () => {
      (vocabulariesDb.get as jest.Mock).mockResolvedValue(true);

      const exists = await vocabularyRepository.exists('vocab123');

      expect(vocabulariesDb.get).toHaveBeenCalledWith('vocab123');
      expect(exists).toBe(true);
    });

    it('should return false if vocabulary does not exist', async () => {
      (vocabulariesDb.get as jest.Mock).mockRejectedValue(new Error('not found'));

      const exists = await vocabularyRepository.exists('nonexistent');

      expect(vocabulariesDb.get).toHaveBeenCalledWith('nonexistent');
      expect(exists).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a new vocabulary and return its ID', async () => {
      const newVocabulary = { words: ['newWord'] };
      (vocabulariesDb.insert as jest.Mock).mockResolvedValue({ id: 'newVocab123' });

      const id = await vocabularyRepository.create(newVocabulary);

      expect(vocabulariesDb.insert).toHaveBeenCalledWith(expect.any(Object));
      expect(id).toBe('newVocab123');
    });
  });

  describe('update', () => {
    it('should update a vocabulary', async () => {
      (vocabulariesDb.get as jest.Mock).mockResolvedValue(mockVocabulary);
      (vocabulariesDb.insert as jest.Mock).mockResolvedValue({ ok: true });

      const updatedVocabulary = await vocabularyRepository.update({
        ...mockVocabulary,
        words: ['newWord'],
      });

      expect(vocabulariesDb.insert).toHaveBeenCalledWith(expect.any(Object));
      expect(updatedVocabulary.words).toContain('newWord');
    });

    it('should throw an error if vocabulary to update is not found', async () => {
      (vocabulariesDb.get as jest.Mock).mockRejectedValue({ statusCode: 404 });

      await expect(
        vocabularyRepository.update({ _id: 'nonexistent', words: [] })
      ).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a vocabulary', async () => {
      (vocabulariesDb.get as jest.Mock).mockResolvedValue({ _id: 'vocab123', _rev: '1-abc' });
      (vocabulariesDb.destroy as jest.Mock).mockResolvedValue({ ok: true });

      await vocabularyRepository.delete('vocab123');

      expect(vocabulariesDb.get).toHaveBeenCalledWith('vocab123');
      expect(vocabulariesDb.destroy).toHaveBeenCalledWith('vocab123', '1-abc');
    });
  });
});
