import { teamRepository } from '../repositories/team.repository';
import { ITeam, ITeamCreateSchema } from '../interfaces/team.interface';

class TeamService {
  async getById(id: string): Promise<ITeam> {
    return teamRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return teamRepository.exists(id);
  }

  async create(team: ITeamCreateSchema): Promise<string> {
    return teamRepository.create(team);
  }

  async update(team: ITeam): Promise<ITeam> {
    //TODO validate members ids

    return teamRepository.update(team);
  }

  async delete(id: string): Promise<void> {
    await teamRepository.delete(id);
  }
}

export const teamService = new TeamService();
