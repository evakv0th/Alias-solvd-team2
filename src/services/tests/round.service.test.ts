import { roundRepository } from "../../repositories/round.repository";
import { chatService } from "../chat.service";
import { gameService } from "../game.service";
import { roundService } from "../round.service";
import { teamService } from "../team.service";
import { userService } from "../user.service";

jest.mock('../../repositories/round.repository');
jest.mock('../game.service');
jest.mock('../user.service');
jest.mock('../team.service');
jest.mock('../chat.service');


describe('RoundService', () => {

    const otherRoundData = {
        finishedAt: new Date(),
        currentWord: 'exampleWord',
    };

    const mockRoundWord = { word: 'exampleWord', guessed: false };

    const mockRoundData = {
        _id: 'someId',
        id: 'round123',
        startedAt: new Date(),
        finishedAt: new Date(),
        teamId: 'team123',
        hostId: 'host123',
        chatId: 'chat123',
        words: [mockRoundWord, { word: 'anotherWord', guessed: true }]
    };

    describe('getById', () => {
        it('should return a round by its id', async () => {
          const roundId = 'round123';
          const mockRound = { id: roundId, ...otherRoundData };
          (roundRepository.getById  as jest.Mock).mockResolvedValue(mockRound);
      
          const round = await roundService.getById(roundId);
      
          expect(round).toEqual(mockRound);
          expect(roundRepository.getById).toHaveBeenCalledWith(roundId);
        });
      });

    describe('getAllByGameId', () => {
        it('should return all rounds for a given game id', async () => {
          const gameId = 'game123';
          const mockGame = { rounds: ['round1', 'round2'] };
          const mockRounds = mockGame.rounds.map(id => ({ id }));
          (gameService.getById  as jest.Mock).mockResolvedValue(mockGame);
          (roundRepository.getById  as jest.Mock).mockImplementation(id => Promise.resolve({ id }));
      
          const rounds = await roundService.getAllByGameId(gameId);
      
          expect(rounds).toEqual(mockRounds);
          expect(gameService.getById).toHaveBeenCalledWith(gameId);
        });
    });

    describe('exists', () => {
        it('should return true if round exists', async () => {
          const roundId = 'round123';
          (roundRepository.exists as jest.Mock).mockResolvedValue(true);
      
          const result = await roundService.exists(roundId);
      
          expect(result).toBeTruthy();
          expect(roundRepository.exists).toHaveBeenCalledWith(roundId);
        });
      
        it('should return false if round does not exist', async () => {
          const roundId = 'roundNotFound';
          (roundRepository.exists as jest.Mock).mockResolvedValue(false);
      
          const result = await roundService.exists(roundId);
      
          expect(result).toBeFalsy();
          expect(roundRepository.exists).toHaveBeenCalledWith(roundId);
        });
    });

    describe('create', () => {
        it('should create a round', async () => {
            const roundData = {
              hostId: 'host123',
              teamId: 'team123',
              chatId: 'chat123',
              finishedAt: new Date(),
              currentWord: 'exampleWord',
            };
            (userService.exists as jest.Mock).mockResolvedValue(true);
            (teamService.exists as jest.Mock).mockResolvedValue(true);
            (chatService.exists as jest.Mock).mockResolvedValue(true); 
            (roundRepository.create as jest.Mock).mockResolvedValue('round123');
        
            const result = await roundService.create(roundData);
        
            expect(result).toBe('round123');
            expect(roundRepository.create).toHaveBeenCalledWith(roundData);
          });
      
        it('should throw an error if host does not exist', async () => {
            const roundData = {
                hostId: 'host123',
                teamId: 'team123',
                chatId: 'chat123',
                finishedAt: new Date(),
                currentWord: 'exampleWord',
            };
          (userService.exists as jest.Mock).mockResolvedValue(false);
      
          await expect(roundService.create(roundData))
            .rejects.toThrow('Host of round is not found.');
        });
        
    });

    describe('update', () => {
        it('should update a round', async () => {
            (roundRepository.update as jest.Mock).mockResolvedValue(mockRoundData);
    
            const result = await roundService.update(mockRoundData);
    
            expect(result).toEqual(mockRoundData);
            expect(roundRepository.update).toHaveBeenCalledWith(mockRoundData);
        });
    });
    
    


    describe('delete', () => {
        it('should delete a round', async () => {
            const roundId = 'round123';
            (roundRepository.delete as jest.Mock).mockResolvedValue(true);
    
            await roundService.delete(roundId);
    
            expect(roundRepository.delete).toHaveBeenCalledWith(roundId);
        });
    });
    
      
      
      
      
      
});
