import { teamRepository } from '../repositories/team.repository';
import { ITeam, ITeamCreateSchema } from '../interfaces/team.interface';
import { userService } from './user.service';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

class TeamService {
  async getById(id: string): Promise<ITeam> {
    return teamRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return teamRepository.exists(id);
  }

  async create(team: ITeamCreateSchema): Promise<string> {
    const hostExists = await userService.exists(team.hostId);
    if (!hostExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Host of team is not found.');
    }
    return teamRepository.create(team);
  }

  async update(team: ITeam): Promise<ITeam> {
    const hostExists = await userService.exists(team.hostId);
    if (!hostExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, 'Host of team is not found.');
    }

    for (const memberId of team.members) {
      const memberExists = await userService.exists(memberId);
      if (!memberExists) {
        throw new HttpException(HttpStatusCode.NOT_FOUND, `Member of team with id ${memberId} is not found.`);
      }
    }
    return teamRepository.update(team);
  }

  async delete(id: string): Promise<void> {
    await teamRepository.delete(id);
  }
}

export const teamService = new TeamService();
