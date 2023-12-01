import { Request, Response } from 'express';
import { userController } from '../users.controller';
import { userService } from '../../services/user.service';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';


jest.mock('../../services/user.service');

const mockRequest = (params = {}, body = {}) => ({
  params,
  body,
}) as unknown as Request;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe('UserController', () => {
  describe('getById', () => {
    it('should return a user when found', async () => {
      const req = mockRequest({ id: 'userId' });
      const res = mockResponse();
      const mockUser = { _id: 'userId', username: 'testUser' };

      (userService.getById as jest.Mock).mockResolvedValue(mockUser);

      await userController.getById(req, res);

      expect(userService.getById).toHaveBeenCalledWith('userId');
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle error when user is not found', async () => {
      const req = mockRequest({ id: 'nonExistentUserId' });
      const res = mockResponse();

      (userService.getById as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'User not found'));

      await userController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle server error', async () => {
      const req = mockRequest({ id: 'userIdWithError' });
      const res = mockResponse();

      (userService.getById as jest.Mock).mockRejectedValue(new Error());

      await userController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('create', () => {
    it('should create a new user and return its ID', async () => {
      const req = mockRequest({}, { username: 'newUser', password: 'password123' });
      const res = mockResponse();

      (userService.create as jest.Mock).mockResolvedValue('newUserId');

      await userController.create(req, res);

      expect(userService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(res.json).toHaveBeenCalledWith({ id: 'newUserId' });
    });

    it('should handle validation error', async () => {
      const req = mockRequest({}, { username: '', password: 'password123' });
      const res = mockResponse();

      (userService.create as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.BAD_REQUEST, 'Invalid data'));

      await userController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid data' });
    });

    it('should handle server error during user creation', async () => {
      const req = mockRequest({}, { username: 'newUser', password: 'password123' });
      const res = mockResponse();

      (userService.create as jest.Mock).mockRejectedValue(new Error());

      await userController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const req = mockRequest({ id: 'userId' }, { username: 'updatedUser' });
      const res = mockResponse();
      const updatedUser = { _id: 'userId', username: 'updatedUser' };

      (userService.update as jest.Mock).mockResolvedValue(updatedUser);

      await userController.update(req, res);

      expect(userService.update).toHaveBeenCalledWith({ _id: 'userId', ...req.body });
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should handle error when user to update is not found', async () => {
      const req = mockRequest({ id: 'nonExistentUserId' }, { username: 'updatedUser' });
      const res = mockResponse();

      (userService.update as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'User not found'));

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle server error during user update', async () => {
      const req = mockRequest({ id: 'userIdWithError' }, { username: 'updatedUser' });
      const res = mockResponse();

      (userService.update as jest.Mock).mockRejectedValue(new Error());

      await userController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('delete', () => {
    it('should delete a user and return no content', async () => {
      const req = mockRequest({ id: 'userId' });
      const res = mockResponse();

      await userController.delete(req, res);

      expect(userService.delete).toHaveBeenCalledWith('userId');
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle error when user to delete is not found', async () => {
      const req = mockRequest({ id: 'nonExistentUserId' });
      const res = mockResponse();

      (userService.delete as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'User not found'));

      await userController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' }); // If using res.json instead of res.send
    });

    it('should handle server error during user deletion', async () => {
      const req = mockRequest({ id: 'userIdWithError' });
      const res = mockResponse();

      (userService.delete as jest.Mock).mockRejectedValue(new Error());

      await userController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' }); // If using res.json instead of res.send
    });
  });
});
