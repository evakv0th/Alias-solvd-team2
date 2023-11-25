import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../middlewares/authenticateToken';
import { secretKey } from '../utils/tokenForAuth/generateToken'; 
import HttpStatusCode from '../utils/exceptions/statusCode';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('authenticateToken', () => {
  const mockRequest = () => {
    const req = {} as Request;
    req.header = jest.fn().mockReturnValue('Bearer token');
    return req;
  };

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNextFunction: NextFunction = jest.fn();

  it('should call next when token is valid', () => {
    const req = mockRequest();
    const res = mockResponse();
    // No token provided
    (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' }); 

    authenticateToken(req, res, mockNextFunction);

    expect(jwt.verify).toHaveBeenCalledWith('token', secretKey);
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should return an error when token is missing', async () => {
    const req = mockRequest();
    req.header = jest.fn().mockReturnValue(undefined); 
    const res = mockResponse();

    await authenticateToken(req, res, mockNextFunction);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Token missing' });
  });

  it('should return an error when token is invalid', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error = new Error('invalid token');
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await authenticateToken(req, res, mockNextFunction);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Invalid token' });
  });
});