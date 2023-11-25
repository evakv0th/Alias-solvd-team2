import { GameRepository } from '../../repositories/game.repository';
import { IGameCreateSchema } from '../../interfaces/game.interface';
import { IGame } from '../../interfaces/game.interface';

const mockedGamesDb = {
  get: jest.fn(),
  insert: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../../couchdb.init', () => ({
  get gamesDb() {
    return mockedGamesDb;
  },
}));

describe('GameRepository', () => {
  let gameRepositoryX: GameRepository;

  const mockGame: IGameCreateSchema = {
    hostId: 'host123',
    teams: ['team1', 'team2'],
    options: {
      goal: 100,
      roundTime: 60,
      vocabularyId: 'vocab123',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    gameRepositoryX = new GameRepository();
  });

  it('should create a new game', async () => {
    mockedGamesDb.insert.mockResolvedValue({ id: 'game123', ok: true });

    const id = await gameRepositoryX.create(mockGame);

    expect(mockedGamesDb.insert).toHaveBeenCalledWith(expect.any(Object));
    expect(id).toBe('game123');
  });

  it('should return true if game exists', async () => {
    mockedGamesDb.get.mockResolvedValue(true);

    const exists = await gameRepositoryX.exists('game123');

    expect(mockedGamesDb.get).toHaveBeenCalledWith('game123');
    expect(exists).toBe(true);
  });

  it('should return false if game does not exist', async () => {
    mockedGamesDb.get.mockRejectedValue(new Error('not found'));

    const exists = await gameRepositoryX.exists('gameNotFound');

    expect(mockedGamesDb.get).toHaveBeenCalledWith('gameNotFound');
    expect(exists).toBe(false);
  });

  it('should update a game', async () => {
    
    const mockOldGame: IGame = {
      _id: 'game123', 
      hostId: mockGame.hostId,
      createdAt: new Date(), 
      teams: mockGame.teams.map(team => ({ teamId: team, score: 0 })),
      currentTeam: mockGame.teams[0], 
      rounds: [], 
      options: mockGame.options,
    };

    mockedGamesDb.get.mockResolvedValue(mockOldGame);


    const updatedGame = await gameRepositoryX.update(mockOldGame);

    expect(mockedGamesDb.insert).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'game123',
      currentTeam: mockOldGame.currentTeam,
      rounds: mockOldGame.rounds,
    }));

    expect(updatedGame).toEqual(mockOldGame);
  });

  it('should delete a game', async () => {
    mockedGamesDb.get.mockImplementation((id, callback) => {
      callback(null, { _id: id, _rev: '1-abc' });
    });
    
    mockedGamesDb.destroy.mockResolvedValue({ ok: true });

    await gameRepositoryX.delete('game123');

    expect(mockedGamesDb.get).toHaveBeenCalledWith('game123', expect.any(Function));
    expect(mockedGamesDb.destroy).toHaveBeenCalledWith('game123', '1-abc');
  });
});
