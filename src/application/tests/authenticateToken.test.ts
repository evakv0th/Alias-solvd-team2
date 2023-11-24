import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { authenticateToken } from '../middlewares/authenticateToken';
import { secretKey } from '../utils/tokenForAuth/generateToken'; 

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
      (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' }); 
  
      authenticateToken(req, res, mockNextFunction);
  
      expect(jwt.verify).toHaveBeenCalledWith('token', secretKey);
      expect(mockNextFunction).toHaveBeenCalled();
    });

});