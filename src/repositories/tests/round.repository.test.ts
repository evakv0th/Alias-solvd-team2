import { RoundRepository } from '../../repositories/round.repository';
import { IRoundCreateSchema } from '../../interfaces/round.interface';


const mockedRoundsDb = {
  get: jest.fn(),
  insert: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../../couchdb.init', () => ({
  get roundsDb() {
    return mockedRoundsDb;
  },
}));

describe('RoundRepository', () => {
  let roundRepository: RoundRepository;

  const mockRound: IRoundCreateSchema = {
    finishedAt: new Date(),
    teamId: 'team1',
    hostId: 'host123',
    chatId: 'chat123',
    currentWord: "word3"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    roundRepository = new RoundRepository();
  });

  it('should create a new round', async () => {
    mockedRoundsDb.insert.mockResolvedValue({ id: 'round123', ok: true });

    const id = await roundRepository.create(mockRound);

    expect(mockedRoundsDb.insert).toHaveBeenCalledWith(expect.any(Object));
    expect(id).toBe('round123');
  });

  it('should return true if round exists', async () => {
    mockedRoundsDb.get.mockResolvedValue(true);

    const exists = await roundRepository.exists('round123');

    expect(mockedRoundsDb.get).toHaveBeenCalledWith('round123');
    expect(exists).toBe(true);
  });

  it('should return false if round does not exist', async () => {
    mockedRoundsDb.get.mockRejectedValue(new Error('not found'));

    const exists = await roundRepository.exists('roundNotFound');

    expect(mockedRoundsDb.get).toHaveBeenCalledWith('roundNotFound');
    expect(exists).toBe(false);
  });

  it('should update a round', async () => {
    const mockOldRound = {
      _id: 'round123',
      startedAt: new Date(),
      finishedAt: mockRound.finishedAt,
      teamId: mockRound.teamId,
      hostId: mockRound.hostId,
      chatId: mockRound.chatId,
      words: [
        { word: 'word1', guessed: true },
        { word: 'word2', guessed: false },
      ],
    };
  
    mockedRoundsDb.get.mockResolvedValue(mockOldRound);
  
    const updatedRound = await roundRepository.update({ 
      ...mockOldRound, 
      words: [
        { word: 'word3', guessed: true },
        { word: 'word4', guessed: false },
      ]
    });
  
    expect(mockedRoundsDb.insert).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'round123',
      words: expect.arrayContaining([
        expect.objectContaining({ word: 'word3', guessed: true }),
        expect.objectContaining({ word: 'word4', guessed: false }),
      ]),
    }));
    expect(updatedRound).toEqual({ 
      ...mockOldRound, 
      words: [
        { word: 'word3', guessed: true },
        { word: 'word4', guessed: false },
      ] 
    });
  });
  

  it('should delete a round', async () => {
    const mockRoundId = 'round123';
    const mockRev = '1-abc';
    mockedRoundsDb.get.mockResolvedValue({ _id: mockRoundId, _rev: mockRev });

    await roundRepository.delete(mockRoundId);

    expect(mockedRoundsDb.get).toHaveBeenCalledWith(mockRoundId);
    expect(mockedRoundsDb.destroy).toHaveBeenCalledWith(mockRoundId, mockRev);
  });
});