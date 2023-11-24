import { gameRepository } from "../repositories/game.repository";
import { GameOptions, IGame, IGameCreateSchema } from "../interfaces/game.interface";
import HttpException from "../application/utils/exceptions/http-exceptions";
import HttpStatusCode from "../application/utils/exceptions/statusCode";

const MAX_TEAMS = 10 // TODO: REMOVE THE MAGICAL_INAPPROPRIACY

class LobbyService 
{
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
    // Check if the user is already in the lobby
    // Check if the user is already in the lobby
    const isUserInLobby = game.teams.some(team => team.members.includes(userId));
    if (isUserInLobby) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'User already in the lobby.');
    }

    // Assign the user to a team
    let assigned = false;
    for (let team of game.teams) {
      if (team.members.length < game.options.maxPlayersPerTeam) {
        team.members.push(userId);
        assigned = true;
        break;
      }
    }
    
    // If not assigned, create a new team if possible
    if (!assigned) {
      if (game.teams.length < MAX_TEAMS) {
        const newTeam = {
          teamId: `team-${game.teams.length + 1}`,
          score: 0,
          members: [userId]
        };
        game.teams.push(newTeam);
      } else {
        throw new HttpException(HttpStatusCode.BAD_REQUEST, 'All teams are full, and no more teams can be created.');
      }
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
    // Check if the selected team exists and if there's room
    const team = game.teams.find(t => t.teamId === teamId);
    if (!team) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Team does not exist.');
    }
    
    if (team.members.length >= game.options.maxPlayersPerTeam) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Team is full.');
    }
    
    // Remove user from any other team they might be on
    game.teams.forEach(t => {
      const index = t.members.indexOf(userId);
      if (index !== -1) {
        t.members.splice(index, 1);
      }
    });

    // Add the user to the new team
    team.members.push(userId);

    return gameRepository.update(game);
  }

  
  async leaveLobby(userId: string, gameId: string): Promise<IGame> 
  {
    const game = await gameRepository.getById(gameId);
    if (!game) 
    {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Lobby not found.');
    }

    // Remove the user from their team
    game.teams.forEach(team => {
      const index = team.members.indexOf(userId);
      if (index !== -1) {
        team.members.splice(index, 1);
      }
    });

    // Optional: Remove any empty teams
    game.teams = game.teams.filter(team => team.members.length > 0);
    
    return gameRepository.update(game);
  }
}

export const lobbyService = new LobbyService();
