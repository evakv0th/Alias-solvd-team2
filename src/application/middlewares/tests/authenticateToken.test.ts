
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatusCode from '../../utils/exceptions/statusCode';
import { RequestWithUser, authenticateToken } from '../authenticateToken';
import * as tokenUtils from '../../utils/tokenForAuth/generateToken';


jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../../utils/tokenForAuth/generateToken', () => ({
  secretKey: 'mockSecretKey',
}));

describe("authenticateToken Middleware", () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      header: jest.fn().mockReturnValue(null),
      cookies: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should call next if token is valid", async () => {
    const token = "validToken";
    mockRequest.header = jest.fn().mockReturnValue(`Bearer ${token}`);
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "123", username: "testUser" });
  
    await authenticateToken(mockRequest as RequestWithUser, mockResponse as Response, nextFunction);
  
    expect(jwt.verify).toHaveBeenCalledWith(token, 'mockSecretKey');
    expect(nextFunction).toHaveBeenCalled();
  });
  

  it("should return 401 if token is missing", async () => {
    await authenticateToken(mockRequest as RequestWithUser, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized - Token missing' });
  });

  it("should return 401 if token is invalid", async () => {
    const token = "invalidToken";
    mockRequest.header = jest.fn().mockReturnValue(`Bearer ${token}`);
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authenticateToken(mockRequest as RequestWithUser, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCode.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized - Invalid token' });
  });


});
