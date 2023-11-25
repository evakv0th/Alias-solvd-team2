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
      words: ['word1', 'word2'],
    };

    mockedRoundsDb.get.mockResolvedValue(mockOldRound);

    const updatedRound = await roundRepository.update({ ...mockOldRound, words: ['word3'] });

    expect(mockedRoundsDb.insert).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'round123',
      words: ['word3'],
    }));
    expect(updatedRound).toEqual({ ...mockOldRound, words: ['word3'] });
  });

  it('should delete a round', async () => {
    const mockGetResponse = { _id: 'round123', _rev: '1-abc' };
    mockedRoundsDb.get.mockImplementation((id, callback) => {
        callback(null, mockGetResponse); 
    });

    mockedRoundsDb.destroy.mockResolvedValue({ ok: true });

    await roundRepository.delete('round123');

    expect(mockedRoundsDb.get).toHaveBeenCalledWith('round123', expect.any(Function));

    expect(mockedRoundsDb.destroy).toHaveBeenCalledWith('round123', '1-abc');
  });
});