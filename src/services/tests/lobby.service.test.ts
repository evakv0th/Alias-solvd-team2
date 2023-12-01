import { gameRepository } from "../../repositories/game.repository";
import { teamRepository } from "../../repositories/team.repository";
import { lobbyService } from "../lobby.service";
import { teamService } from "../team.service";



jest.mock('../../repositories/game.repository');
jest.mock('../../repositories/team.repository');
jest.mock('../team.service');

describe('LobbyService', () => {

  const mockGame = {
    hostId: 'host123',
    teams: [],
    options: {
      goal: 100,
      roundTime: 60,
      vocabularyId: 'vocab123',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (gameRepository.create as jest.Mock).mockResolvedValue('gameId123');
    (gameRepository.getById as jest.Mock).mockResolvedValue(mockGame);
    (teamRepository.getById  as jest.Mock).mockResolvedValue({ teamId: 'team1', members: [] });
    (teamService.create  as jest.Mock).mockResolvedValue('teamId123');
    (gameRepository.update as jest.Mock).mockImplementation(async (game) => {
        return { ...game };
    });
  });

  describe('createLobby', () => {
    it('should create a lobby successfully', async () => {
      const hostId = 'host123';
      const options = { goal: 100, roundTime: 60, vocabularyId: 'vocab123' };
  
      const gameId = await lobbyService.createLobby(hostId, options);
  
      expect(gameId).toEqual('gameId123');
      expect(gameRepository.create).toHaveBeenCalledWith({
        hostId,
        options,
        teams: [],
      });
    });
  
    it('should throw an error if lobby cannot be created', async () => {
      (gameRepository.create as jest.Mock).mockResolvedValueOnce(null);
  
        const faultyOptions = { goal: 100, roundTime: 60, vocabularyId: 'vocab123' }; 
        await expect(lobbyService.createLobby('host123', faultyOptions))
            .rejects.toThrow('Lobby could not be created.');
    });
  
  });

  describe('joinLobby', () => {
    it('should allow a user to join an existing lobby', async () => {
      const userId = 'user1';
      const gameId = 'gameId123';
  
      const game = await lobbyService.joinLobby(userId, gameId);
  
      expect(game).toBeDefined();
      expect(gameRepository.getById).toHaveBeenCalledWith(gameId);
    });
  
    it('should throw an error if lobby does not exist', async () => {
      const userId = 'user1';
      const gameId = 'invalidGameId';
  
      (gameRepository.getById as jest.Mock).mockResolvedValueOnce(null);
  
      await expect(lobbyService.joinLobby(userId, gameId))
        .rejects.toThrow('Lobby not found.');
    });
  
    it('should throw an error if user already in the lobby', async () => {
        const userId = 'user1';
        const gameId = 'gameId123';
      
        lobbyService['teamMembers'].set('teamId', new Set([userId]));
    
        await expect(lobbyService.joinLobby(userId, gameId))
          .rejects.toThrow('User already in the lobby.');
      });
  });

  describe('selectTeam', () => {
    it('should allow a user to select a team in the lobby', async () => {
      const userId = 'user1';
      const gameId = 'gameId123';
      const teamId = 'team1';
  
      const game = await lobbyService.selectTeam(userId, gameId, teamId);
  
      expect(game).toBeDefined();
      expect(gameRepository.getById).toHaveBeenCalledWith(gameId);
      expect(teamRepository.getById).toHaveBeenCalledWith(teamId);
    });
  
    it('should throw an error if lobby does not exist', async () => {
      const userId = 'user1';
      const gameId = 'invalidGameId';
      const teamId = 'team1';
  
      (gameRepository.getById as jest.Mock).mockResolvedValueOnce(null);
  
      await expect(lobbyService.selectTeam(userId, gameId, teamId))
        .rejects.toThrow('Lobby not found.');
    });
  
    it('should throw an error if team does not exist', async () => {
        const userId = 'user1';
        const gameId = 'gameId123';
        const teamId = 'invalidTeamId';
      
        (teamRepository.getById as jest.Mock).mockResolvedValueOnce(null);
    
        await expect(lobbyService.selectTeam(userId, gameId, teamId))
          .rejects.toThrow('Team not found.');
      });
  });

  describe('leaveLobby', () => {
    it('should allow a user to leave the lobby', async () => {
      const userId = 'user1';
      const gameId = 'gameId123';
  
      const game = await lobbyService.leaveLobby(userId, gameId);
  
      expect(game).toBeDefined();
      expect(gameRepository.getById).toHaveBeenCalledWith(gameId);
    });
  
    it('should throw an error if lobby does not exist', async () => {
      const userId = 'user1';
      const gameId = 'invalidGameId';
  
      (gameRepository.getById as jest.Mock).mockResolvedValueOnce(null);
  
      await expect(lobbyService.leaveLobby(userId, gameId))
        .rejects.toThrow('Lobby not found.');
    });
  
    it('should throw an error if user is not in any team', async () => {
        const userId = 'user1';
        const gameId = 'gameId123';
      
        lobbyService['teamMembers'].clear();
    
        await expect(lobbyService.leaveLobby(userId, gameId))
          .rejects.toThrow('Error leaving lobby: User is not in any team.');
      });
  });
  
  
  


});