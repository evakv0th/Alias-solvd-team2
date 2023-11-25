import { VocabularyRepository } from '../../repositories/vocabulary.repository';
import { IVocabularyCreateSchema } from '../../interfaces/vocabulary.interface';

// Mock the vocabulariesDb module
const mockedVocabulariesDb = {
  get: jest.fn(),
  insert: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../../couchdb.init', () => ({
  get vocabulariesDb() {
    return mockedVocabulariesDb;
  },
}));

describe('VocabularyRepository', () => {
  let vocabularyRepository: VocabularyRepository;

  const mockVocabulary: IVocabularyCreateSchema = {
    words: ['test', 'vocabulary', 'words'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    vocabularyRepository = new VocabularyRepository();
  });

  it('should create a new vocabulary', async () => {
    mockedVocabulariesDb.insert.mockResolvedValue({ id: 'vocabulary123', ok: true });

    const id = await vocabularyRepository.create(mockVocabulary);

    expect(mockedVocabulariesDb.insert).toHaveBeenCalledWith(expect.any(Object));
    expect(id).toBe('vocabulary123');
  });

  it('should return a vocabulary by ID', async () => {
    const expectedVocabulary = {
      _id: 'vocabulary123',
      words: mockVocabulary.words,
    };
    mockedVocabulariesDb.get.mockResolvedValue(expectedVocabulary);

    const vocabulary = await vocabularyRepository.getById('vocabulary123');

    expect(mockedVocabulariesDb.get).toHaveBeenCalledWith('vocabulary123');
    expect(vocabulary).toEqual(expectedVocabulary);
  });

  it('should check if a vocabulary exists by ID', async () => {
    mockedVocabulariesDb.get.mockResolvedValue(true);

    const exists = await vocabularyRepository.exists('vocabulary123');

    expect(mockedVocabulariesDb.get).toHaveBeenCalledWith('vocabulary123');
    expect(exists).toBe(true);
  });

  it('should update a vocabulary', async () => {
    const mockOldVocabulary = {
      _id: 'vocabulary123',
      words: ['old', 'words'],
    };
    mockedVocabulariesDb.get.mockResolvedValue(mockOldVocabulary);

    const newWords = ['new', 'words'];
    const updatedVocabulary = await vocabularyRepository.update({ ...mockOldVocabulary, words: newWords });

    expect(mockedVocabulariesDb.insert).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'vocabulary123',
      words: newWords,
    }));
    expect(updatedVocabulary.words).toEqual(newWords);
  });

  it('should delete a vocabulary', async () => {
    const mockGetResponse = { _id: 'vocabulary123', _rev: '1-abc' };
    mockedVocabulariesDb.get.mockImplementation((id, callback) => {
      callback(null, mockGetResponse);
    });
    mockedVocabulariesDb.destroy.mockResolvedValue({ ok: true });

    await vocabularyRepository.delete('vocabulary123');

    expect(mockedVocabulariesDb.get).toHaveBeenCalledWith('vocabulary123', expect.any(Function));
    expect(mockedVocabulariesDb.destroy).toHaveBeenCalledWith('vocabulary123', '1-abc');
  });
});
