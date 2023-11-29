import { teamRepository } from '../repositories/team.repository';
import { ITeam, ITeamCreateSchema } from '../interfaces/team.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

class TeamService {
  async getById(id: string): Promise<ITeam> {
    try {
      return teamRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'team not found by id!',
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return teamRepository.exists(id);
  }

  async create(team: ITeamCreateSchema): Promise<string> {
    return teamRepository.create(team);
  }

  async update(team: ITeam): Promise<ITeam> {
    //TODO validate members ids
    try {
      return teamRepository.update(team);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'team not found by id!',
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await teamRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'team not found by id!',
      );
    }
  }
}

export const teamService = new TeamService();
