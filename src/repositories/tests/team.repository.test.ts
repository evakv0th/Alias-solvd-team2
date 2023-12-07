import { TeamRepository } from '../../repositories/team.repository';
import { ITeamCreateSchema } from '../../interfaces/team.interface';

const mockedTeamsDb = {
  get: jest.fn(),
  insert: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../../couchdb.init', () => ({
  get teamsDb() {
    return mockedTeamsDb;
  },
}));

describe('TeamRepository', () => {
  let teamRepository: TeamRepository;

  const mockTeam: ITeamCreateSchema = {
    name: 'Team Awesome',
    hostId: 'host123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    teamRepository = new TeamRepository();
  });

  it('should create a new team', async () => {
    mockedTeamsDb.insert.mockResolvedValue({ id: 'team123', ok: true });

    const id = await teamRepository.create(mockTeam);

    expect(mockedTeamsDb.insert).toHaveBeenCalledWith(expect.any(Object));
    expect(id).toBe('team123');
  });

  it('should return true if team exists', async () => {
    mockedTeamsDb.get.mockResolvedValue(true);

    const exists = await teamRepository.exists('team123');

    expect(mockedTeamsDb.get).toHaveBeenCalledWith('team123');
    expect(exists).toBe(true);
  });

  it('should return false if team does not exist', async () => {
    mockedTeamsDb.get.mockRejectedValue(new Error('not found'));

    const exists = await teamRepository.exists('teamNotFound');

    expect(mockedTeamsDb.get).toHaveBeenCalledWith('teamNotFound');
    expect(exists).toBe(false);
  });

  it('should update a team', async () => {
    const mockOldTeam = {
      _id: 'team123',
      hostId: 'host123',
      name: 'Team Awesome',
      members: ['member1'],
    };
  
    mockedTeamsDb.get.mockResolvedValue(mockOldTeam);
  
    const updatedTeam = await teamRepository.update({ ...mockOldTeam, members: ['member1', 'member2'] });
  
    expect(mockedTeamsDb.insert).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'team123',
      hostId: 'host123',
      name: 'Team Awesome',
      members: expect.arrayContaining(['member1', 'member2', 'host123']),
    }));
    expect(updatedTeam).toEqual({ ...mockOldTeam, members: ['member1', 'member2', 'host123'] });
  });
  

  it('should delete a team', async () => {
    const teamId = 'team3141592';
    const rev = '1e-3141592';

    mockedTeamsDb.get.mockResolvedValue({ _id: teamId, _rev: rev });

    await teamRepository.delete(teamId);

    expect(mockedTeamsDb.get).toHaveBeenCalledWith(teamId);
    expect(mockedTeamsDb.destroy).toHaveBeenCalledWith(teamId, rev);
  });
});
