import { UserRepository } from '../../repositories/user.repository';
import { IUserCreateSchema } from '../../interfaces/user.interface';

const mockedUsersDb = {
  get: jest.fn(),
  insert: jest.fn(),
  destroy: jest.fn(),
  view: jest.fn(),
};

jest.mock('../../couchdb.init', () => ({
  get usersDb() {
    return mockedUsersDb;
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const mockUser: IUserCreateSchema = {
    username: 'newuser',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository();
  });

  it('should create a new user', async () => {
    mockedUsersDb.insert.mockResolvedValue({ id: 'user123', ok: true });

    const id = await userRepository.create(mockUser);

    expect(mockedUsersDb.insert).toHaveBeenCalledWith(expect.any(Object));
    expect(id).toBe('user123');
  });

  it('should return a user by ID', async () => {
    const expectedUser = {
      _id: 'user123',
      ...mockUser,
      createdAt: expect.any(Date),
      stats: { roundPlayed: 0, wordsGuessed: 0 },
    };
    mockedUsersDb.get.mockResolvedValue(expectedUser);

    const user = await userRepository.getById('user123');

    expect(mockedUsersDb.get).toHaveBeenCalledWith('user123');
    expect(user).toEqual(expectedUser);
  });

  it('should return a user by username', async () => {
    const expectedUser = {
      _id: 'user123',
      ...mockUser,
      createdAt: expect.any(Date),
      stats: { roundPlayed: 0, wordsGuessed: 0 },
    };
    mockedUsersDb.view.mockResolvedValue({ rows: [{ doc: expectedUser }] });

    const user = await userRepository.getByUsername('newuser');

    expect(mockedUsersDb.view).toHaveBeenCalledWith('views', 'byUsername', { key: 'newuser', include_docs: true });
    expect(user).toEqual(expectedUser);
  });

  it('should check if a user exists by username', async () => {
    mockedUsersDb.view.mockResolvedValue({ rows: [{ doc: { username: 'newuser' } }] });

    const exists = await userRepository.exists('newuser');

    expect(mockedUsersDb.view).toHaveBeenCalledWith('views', 'byUsername', { key: 'newuser', include_docs: true });
    expect(exists).toBe(true);
  });

  it('should update a user', async () => {
    const mockOldUser = {
      _id: 'user123',
      ...mockUser,
      createdAt: new Date(),
      stats: { roundPlayed: 5, wordsGuessed: 4 },
    };
    mockedUsersDb.get.mockResolvedValue(mockOldUser);

    const updatedStats = { roundPlayed: 10, wordsGuessed: 9 };
    const updatedUser = await userRepository.update({ ...mockOldUser, stats: updatedStats });

    expect(mockedUsersDb.insert).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'user123',
      stats: updatedStats,
    }));
    expect(updatedUser.stats).toEqual(updatedStats);
  });

  it('should delete a user', async () => {
    mockedUsersDb.get.mockImplementation((id, callback) => {
      callback(null, { _id: id, _rev: '1-abc' });
    });
    mockedUsersDb.destroy.mockResolvedValue({ ok: true });

    await userRepository.delete('user123');

    expect(mockedUsersDb.get).toHaveBeenCalledWith('user123', expect.any(Function));
    expect(mockedUsersDb.destroy).toHaveBeenCalledWith('user123', '1-abc');
  });
});
