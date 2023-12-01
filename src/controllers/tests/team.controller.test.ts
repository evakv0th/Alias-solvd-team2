import { Request, Response } from 'express';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import * as teamController from '../team.controller';
import { teamService } from '../../services/team.service';
import { userService } from '../../services/user.service';

jest.mock('../../services/team.service');
jest.mock('../../services/user.service');

const mockRequest = (params = {}, body = {}, user = {}) => ({
    params,
    body,
    user,
}) as unknown as Request;

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};

describe('getById', () => {
    it('should return a team when found', async () => {
        const req = mockRequest({ id: 'teamId' });
        const res = mockResponse();
        const mockTeam = { _id: 'teamId', name: 'TeamName', members: [] };

        (teamService.getById as jest.Mock).mockResolvedValue(mockTeam);

        await teamController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
        expect(res.json).toHaveBeenCalledWith(mockTeam);
    });

    it('should handle error when team is not found', async () => {
        const req = mockRequest({ id: 'nonExistentTeamId' });
        const res = mockResponse();

        (teamService.getById as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'Team not found'));

        await teamController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
    });

});

describe('updateMembers', () => {
    it('should update team members when authorized', async () => {
        const req = mockRequest({ id: 'teamId' }, [], { _id: 'hostId' });
        const res = mockResponse();
        const mockTeam = { _id: 'teamId', name: 'TeamName', members: [], hostId: 'hostId' };

        (teamService.getById as jest.Mock).mockResolvedValue(mockTeam);
        (teamService.update as jest.Mock).mockResolvedValue(mockTeam);

        await teamController.updateMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    });

    it('should return unauthorized if not team host', async () => {
        const req = mockRequest({ id: 'teamId' }, [], { _id: 'nonHostId' });
        const res = mockResponse();
        const mockTeam = { _id: 'teamId', name: 'TeamName', members: [], hostId: 'hostId' };

        (teamService.getById as jest.Mock).mockResolvedValue(mockTeam);

        await teamController.updateMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
    });

});

describe('addMemberByName', () => {
    it('should add a member to the team', async () => {
        const req = mockRequest({ id: 'teamId', username: 'newUser' }, {}, { _id: 'hostUserId' });
        const res = mockResponse();
        const mockUser = { _id: 'userId', username: 'newUser' };
        const mockTeam = { _id: 'teamId', members: [], hostId: 'hostUserId' };

        (userService.getByUsername as jest.Mock).mockResolvedValue(mockUser);
        (teamService.getById as jest.Mock).mockResolvedValue(mockTeam);
        (teamService.update as jest.Mock).mockResolvedValue({ ...mockTeam, members: ['userId'] });

        await teamController.addMemberByName(req, res);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
    });

    it('should return not found if user does not exist', async () => {
        const req = mockRequest({ id: 'teamId', username: 'nonExistentUser' });
        const res = mockResponse();

        (userService.getByUsername as jest.Mock).mockResolvedValue(null);

        await teamController.addMemberByName(req, res);

        expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
    });

});
