import {teamsDb} from "../couchdb.init";
import {ITeam, ITeamCreateSchema} from "../interfaces/team.interface";

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

export class TeamRepository {

  async getById(id: string): Promise<ITeam> {
    return await teamsDb.get(id);
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
    await teamsDb.insert(oldTeam);
    return oldTeam;
  }

  async delete(id: string) {
    await teamsDb.get(id, (err, body) => {
      if (!err) {
        teamsDb.destroy(id, body._rev);
      }
    });
  }

}

export const teamRepository = new TeamRepository();