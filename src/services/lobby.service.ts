import { gameRepository } from "../repositories/game.repository";
import { GameOptions, IGame, IGameCreateSchema } from "../interfaces/game.interface";
import HttpException from "../application/utils/exceptions/http-exceptions";
import HttpStatusCode from "../application/utils/exceptions/statusCode";


class LobbyService 
{
  private teamMembers: Map<string, Set<string>> = new Map();

  async createLobby(hostId: string, options: GameOptions): Promise<string> 
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

  async joinLobby(userId: string, gameId: string): Promise<IGame> 
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

    let assigned = false;

    for (const team of game.teams) 
    {
      const members = this.teamMembers.get(team.teamId) ?? new Set<string>();
      if (members.size < game.options.maxPlayersPerTeam) 
      {
        members.add(userId);
        this.teamMembers.set(team.teamId, members);
        assigned = true;
        break;
      }
    }
    
    if (!assigned) 
    {
      const newTeamId = `team-${game.teams.length + 1}`;
      game.teams.push({
        teamId: newTeamId,
        score: 0
      });
      this.teamMembers.set(newTeamId, new Set([userId]));
    } 
    else if (!assigned) 
    {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'All teams are full, and no more teams can be created.');
    }

    return gameRepository.update(game);
  }


  async selectTeam(userId: string, gameId: string, teamId: string): Promise<IGame> 
  {
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

    const members = this.teamMembers.get(teamId) ?? new Set<string>();

    if (members.size >= game.options.maxPlayersPerTeam) 
    {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Team is full.');
    }

    members.add(userId);

    this.teamMembers.set(teamId, members);

    return gameRepository.update(game);
  }

  
  async leaveLobby(userId: string, gameId: string): Promise<IGame> 
  {
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
}

export const lobbyService = new LobbyService();