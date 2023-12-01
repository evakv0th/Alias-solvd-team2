import {gameRepository} from "../repositories/game.repository";
import {GameOptions, IGame, IGameCreateSchema} from "../interfaces/game.interface";
import HttpException from "../application/utils/exceptions/http-exceptions";
import HttpStatusCode from "../application/utils/exceptions/statusCode";
import { ITeamCreateSchema } from "../interfaces/team.interface";
import { teamService } from "./team.service";
import { teamRepository } from "../repositories/team.repository";

class LobbyService 
{
  private teamMembers: Map<string, Set<string>> = new Map();

  async createLobby(hostId: string, options: GameOptions): Promise<string> 
  {
    try 
    {
      const gameCreateSchema: IGameCreateSchema = {
        hostId: hostId,
        options: options,
        teams: [],
      };

      const gameId = await gameRepository.create(gameCreateSchema);

      if (!gameId) 
      {
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Lobby could not be created.');
      }

      return gameId;
    } 
    catch (error) 
    {
      let message = 'Unknown error';
      if (error instanceof Error) 
      {
        message = error.message;
      }
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error creating lobby: ' + message);
    }
  }

  async joinLobby(userId: string, gameId: string): Promise<IGame> 
  {
    try 
    {
      const game = await gameRepository.getById(gameId);

      if (!game) 
      {
        throw new HttpException(HttpStatusCode.NOT_FOUND, 'Lobby not found.');
      }
    
      const isUserInLobby = Array.from(this.teamMembers.values()).some(members => members.has(userId));

      if (isUserInLobby) 
      {
        throw new HttpException(HttpStatusCode.BAD_REQUEST, 'User already in the lobby.');
      }

      let leastPopulatedTeam = null;
      let minMembersCount = Infinity;

      for (const team of game.teams) 
      {
        const members = this.teamMembers.get(team.teamId) ?? new Set<string>();
        if (members.size < minMembersCount) 
        {
          leastPopulatedTeam = team.teamId;
          minMembersCount = members.size;
        }
      }

      if (!leastPopulatedTeam || game.teams.length === 0) 
      {
        const newTeamData: ITeamCreateSchema = {
          name: `Team ${game.teams.length + 1}`,
          hostId: userId
        };
        const newTeamId = await teamService.create(newTeamData);
        game.teams.push({ teamId: newTeamId, score: 0 });
        this.teamMembers.set(newTeamId, new Set([userId]));
      } 
      else 
      {
        this.teamMembers.get(leastPopulatedTeam)?.add(userId);
      }

      await gameRepository.update(game);

      return gameRepository.getById(gameId);
    } 
    catch (error) 
    {
      let message = 'Unknown error';
      if (error instanceof Error) 
      {
        message = error.message;
      }
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error joining lobby: ' + message);
    }
  }

  async selectTeam(userId: string, gameId: string, teamId: string): Promise<IGame> 
  {
    try {
      const game = await gameRepository.getById(gameId);

      if (!game) 
      {
        throw new HttpException(HttpStatusCode.NOT_FOUND, 'Lobby not found.');
      }

      const team = await teamRepository.getById(teamId);
      if (!team) {
        throw new HttpException(HttpStatusCode.NOT_FOUND, 'Team not found.');
      }

      game.teams.forEach((team) => {
        const members = this.teamMembers.get(team.teamId) ?? new Set<string>();
        if (members.has(userId)) 
        {
          members.delete(userId);
          this.teamMembers.set(team.teamId, members);
        }
      });

      const members = this.teamMembers.get(teamId) ?? new Set<string>();
      members.add(userId);
      this.teamMembers.set(teamId, members);

      team.members = Array.from(members);
      await teamRepository.update(team);

      return await gameRepository.update(game);
    } 
    catch (error) 
    {
      let message = 'Unknown error';
      if (error instanceof Error) 
      {
        message = error.message;
      }
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error selecting team: ' + message);
    }
  }

  
  async leaveLobby(userId: string, gameId: string): Promise<IGame> 
  {
    try {
      const game = await gameRepository.getById(gameId);

      if (!game) 
      {
        throw new HttpException(HttpStatusCode.NOT_FOUND, 'Lobby not found.');
      }

      this.teamMembers.forEach((members) => {
        if (members.has(userId)) 
        {
          members.delete(userId);
        }
      });

      return gameRepository.update(game);
    } 
    catch (error) 
    {
      let message = 'Unknown error';
      if (error instanceof Error)
      {
        message = error.message;
      }
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error leaving lobby: ' + message);
    }
  }
}

export const lobbyService = new LobbyService();