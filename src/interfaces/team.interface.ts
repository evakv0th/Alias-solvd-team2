export interface ITeam {
  _id: string | undefined;
  hostId: string;
  name: string;
  members: string[];
}

export interface ITeamCreateSchema {
  name: string;
  hostId: string;
}
