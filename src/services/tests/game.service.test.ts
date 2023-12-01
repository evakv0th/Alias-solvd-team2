import { gameRepository } from '../../repositories/game.repository';
import { vocabularyService } from '../vocabulary.service';
import { roundService } from '../round.service';
import { chatService } from '../chat.service';
import { teamService } from '../team.service';
import { userService } from '../user.service';
import { GameService } from '../game.service';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';

jest.mock('../../repositories/game.repository');
jest.mock('../vocabulary.service');
jest.mock('../round.service');
jest.mock('../chat.service');
jest.mock('../team.service');
jest.mock('../user.service');

const gameService = new GameService();

describe('GameService', () => {
  describe('create', () => {
    it('should create a new game if host and teams exist', async () => {
      const mockGame = { hostId: 'hostId', teams: ['team1', 'team2'], options: { maxPlayersPerTeam: 10, goal: 10, roundTime: 100,  vocabularyId: '0' } };
      (userService.exists as jest.Mock).mockResolvedValue(true);
      (teamService.exists as jest.Mock).mockResolvedValue(true);
      (gameRepository.create as jest.Mock).mockResolvedValue('gameId');

      const result = await gameService.create(mockGame);

      expect(userService.exists).toHaveBeenCalledWith('hostId');
      expect(teamService.exists).toHaveBeenCalledTimes(2);
      expect(gameRepository.create).toHaveBeenCalledWith(mockGame);
      expect(result).toBe('gameId');
    });

    it('should throw an error if host does not exist', async () => {
        const mockGame = { hostId: 'hostId', teams: ['team1', 'team2'], options: { maxPlayersPerTeam: 10, goal: 10, roundTime: 100,  vocabularyId: '0' } };
      (userService.exists as jest.Mock).mockResolvedValue(false);

      await expect(gameService.create(mockGame)).rejects.toThrow(HttpException);
    });
  });
});
