import { gameRepository } from '../../repositories/game.repository';
import { roundService } from '../round.service';
import { teamService } from '../team.service';
import { userService } from '../user.service';
import { GameService } from '../game.service';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import { IGame, IGameCreateSchema } from '../../interfaces/game.interface';
import { vocabularyService } from '../vocabulary.service'; 

jest.mock('../../repositories/game.repository');
jest.mock('../vocabulary.service');
jest.mock('../round.service');
jest.mock('../chat.service');
jest.mock('../team.service');
jest.mock('../user.service');

const gameService = new GameService();

describe('GameService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new game if host and teams exist', async () => {
      const mockGameCreate: IGameCreateSchema = {
        hostId: 'host123',
        teams: ['team1', 'team2'],
        options: {
          goal: 100,
          roundTime: 60,
          vocabularyId: 'vocab123',
        },
      };

      (userService.exists as jest.Mock).mockResolvedValue(true);
      (teamService.exists as jest.Mock).mockResolvedValue(true);
      (vocabularyService.exists as jest.Mock).mockResolvedValue(true);

      (gameRepository.create as jest.Mock).mockResolvedValue('game123');

      const result = await gameService.create(mockGameCreate);

      expect(userService.exists).toHaveBeenCalledWith(mockGameCreate.hostId);
      expect(teamService.exists).toHaveBeenCalledTimes(mockGameCreate.teams.length);
      mockGameCreate.teams.forEach(teamId => {
        expect(teamService.exists).toHaveBeenCalledWith(teamId);
      });
      expect(vocabularyService.exists).toHaveBeenCalledWith(mockGameCreate.options.vocabularyId);
      expect(gameRepository.create).toHaveBeenCalledWith(mockGameCreate);
      expect(result).toBe('game123');
    });

    it('should throw an error if host does not exist', async () => {
        const mockGame = { hostId: 'hostId', teams: ['team1', 'team2'], options: { maxPlayersPerTeam: 10, goal: 10, roundTime: 100,  vocabularyId: '0' } };
      (userService.exists as jest.Mock).mockResolvedValue(false);

      await expect(gameService.create(mockGame)).rejects.toThrow(HttpException);
    });
  });
  describe('getById', () => {
    it('should retrieve a game by its ID', async () => {
      const mockGameId = 'gameId';
      const mockGame = { _id: mockGameId, hostId: 'host1', teams: [], options: {} };
      (gameRepository.getById as jest.Mock).mockResolvedValue(mockGame);

      const result = await gameService.getById(mockGameId);

      expect(gameRepository.getById).toHaveBeenCalledWith(mockGameId);
      expect(result).toBe(mockGame);
    });
  });

  describe('exists', () => {
    it('should check if a game exists', async () => {
      const mockGameId = 'gameId';
      (gameRepository.exists as jest.Mock).mockResolvedValue(true);

      const exists = await gameService.exists(mockGameId);

      expect(gameRepository.exists).toHaveBeenCalledWith(mockGameId);
      expect(exists).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete a game by its ID', async () => {
      const mockGameId = 'gameId';
      await gameService.delete(mockGameId);

      expect(gameRepository.delete).toHaveBeenCalledWith(mockGameId);
    });
  });

  const mockGameCreate: IGameCreateSchema = {
    hostId: 'host123',
    teams: ['team1', 'team2'],
    options: {
      goal: 100,
      roundTime: 60,
      vocabularyId: 'vocab123',
    },
  };

  const mockGame: IGame = {
    _id: 'game123',
    hostId: mockGameCreate.hostId,
    createdAt: new Date(),
    teams: mockGameCreate.teams.map(team => ({ teamId: team, score: 0, members: [] })),
    currentTeam: 'team1',
    rounds: [],
    options: mockGameCreate.options,
  };


  describe('GameService.update(mockGame)', () => {
    it('should update a game successfully', async () => {
      
      (teamService.exists as jest.Mock).mockResolvedValue(true);
      (roundService.exists as jest.Mock).mockResolvedValue(true);
      (gameRepository.update as jest.Mock).mockResolvedValue(mockGame);
  
      const result = await gameService.update(mockGame);
  
      expect(result).toEqual(mockGame);
    });

});

  describe('GameService.create(mockGame)', () => {
    it('should create a new game if host and teams exist', async () => {
      (userService.exists as jest.Mock).mockResolvedValue(true);
      (teamService.exists as jest.Mock).mockResolvedValue(true);
      (gameRepository.create as jest.Mock).mockResolvedValue('game123');

      const result = await gameService.create(mockGameCreate);

      expect(userService.exists).toHaveBeenCalledWith('host123');
      expect(teamService.exists).toHaveBeenCalledTimes(2);
      expect(gameRepository.create).toHaveBeenCalledWith(mockGameCreate);
      expect(result).toBe('game123');
    });
  });

  describe('GameService.getById(mockGame)', () => {
    it('should retrieve a game by its ID', async () => {
      (gameRepository.getById as jest.Mock).mockResolvedValue(mockGame);

      const result = await gameService.getById('game123');

      expect(gameRepository.getById).toHaveBeenCalledWith('game123');
      expect(result).toEqual(mockGame);
    });
  });

});