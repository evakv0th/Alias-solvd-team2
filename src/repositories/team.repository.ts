import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { teamsDb } from '../couchdb.init';
import { ITeam, ITeamCreateSchema } from '../interfaces/team.interface';

class Team implements ITeam {
  _id: string | undefined;
  hostId: string;
  name: string;
  members: string[];

  constructor(team: ITeamCreateSchema) {
    this.name = team.name;
    this.hostId = team.hostId;
    this.members = [];
  }
}

<<<<<<< HEAD
export class TeamRepository {

=======
class TeamRepository {
>>>>>>> remotes/origin/dev
  async getById(id: string): Promise<ITeam> {
    try {
      return await teamsDb.get(id);
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Team not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      await teamsDb.get(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async create(team: ITeamCreateSchema): Promise<string> {
    const createdTeam = new Team(team);
    createdTeam.members.push(team.hostId);
    const response = await teamsDb.insert(createdTeam);
    return response.id;
  }

  async update(team: ITeam): Promise<ITeam> {
    const oldTeam = await this.getById(team._id!);
    oldTeam.name = team.name;
    oldTeam.members = team.members;
    if (!oldTeam.members.includes(oldTeam.hostId)) {
      oldTeam.members.push(oldTeam.hostId);
    }
    try {
      await teamsDb.insert(oldTeam);
      return oldTeam;
    } catch (error) {
      if ((error as any).statusCode == 404) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          'Team not found by id',
        );
      } else {
        throw new HttpException(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          'Internal server error',
        );
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const doc = await teamsDb.get(id);
      await teamsDb.destroy(id, doc._rev);
    } catch (err) {
      console.error(err);
    }
  }
}

export const teamRepository = new TeamRepository();
