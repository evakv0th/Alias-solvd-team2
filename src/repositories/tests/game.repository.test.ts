import { gameRepository } from '../game.repository';
import { gamesDb } from '../../couchdb.init';
import { IGameCreateSchema } from '../../interfaces/game.interface';


jest.mock('../../couchdb.init', () => ({
  gamesDb: {
    get: jest.fn(),
    insert: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('GameRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new game and return the id', async () => {
    const mockGame: IGameCreateSchema = {
      hostId: 'host123',
      teams: ['team1', 'team2'],
      options: {
        goal: 3,
        roundTime: 10,
        vocabularyId: '257'

      },
    };
    const mockId = 'game123';
    (gamesDb.insert as jest.Mock).mockResolvedValue({ id: mockId });

    const gameId = await gameRepository.create(mockGame);
    expect(gameId).toBe(mockId);
    expect(gamesDb.insert).toHaveBeenCalledWith(expect.any(Game));
  });

  it('should return true if a game exists', async () => {
    const gameId = 'game123';
    (gamesDb.get as jest.Mock).mockResolvedValue({ _id: gameId });

    const exists = await gameRepository.exists(gameId);
    expect(exists).toBe(true);
    expect(gamesDb.get).toHaveBeenCalledWith(gameId);
  });

  it('should return false if a game does not exist', async () => {
    const gameId = 'non_existent_game';
    (gamesDb.get as jest.Mock).mockRejectedValue(new Error('not found'));

    const exists = await gameRepository.exists(gameId);
    expect(exists).toBe(false);
    expect(gamesDb.get).toHaveBeenCalledWith(gameId);
  });

  it('should update a game and return the updated game', async () => {
    const gameId = 'game123';
    const updatedData = {
      _id: gameId,
      currentTeam: 'team2',
      rounds: ['round1'],
      // ... other properties you may need to update
    };
    const oldGameData = {
      _id: gameId,
      currentTeam: 'team1',
      rounds: [],
      // ... other properties
    };
    (gamesDb.get as jest.Mock).mockResolvedValue(oldGameData);
    (gamesDb.insert as jest.Mock).mockResolvedValue({ id: gameId });

    const game = await gameRepository.update(updatedData);
    expect(game).toEqual(expect.objectContaining(updatedData));
    expect(gamesDb.get).toHaveBeenCalledWith(gameId);
    expect(gamesDb.insert).toHaveBeenCalledWith(expect.any(Game));
  });

  it('should delete a game by id', async () => {
    const gameId = 'game123';
    const rev = 'rev123';
    (gamesDb.get as jest.Mock).mockImplementation((id, callback) => {
      callback(null, { _id: id, _rev: rev });
    });

    await gameRepository.delete(gameId);
    expect(gamesDb.get).toHaveBeenCalledWith(gameId, expect.any(Function));
    expect(gamesDb.destroy).toHaveBeenCalledWith(gameId, rev);
  });


});
