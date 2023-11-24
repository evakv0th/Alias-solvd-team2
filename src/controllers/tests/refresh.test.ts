import request from 'supertest';
import app from '../../index'; // Assuming this is the correct path to your Express app
import jwt, { Secret, VerifyOptions } from 'jsonwebtoken';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import { generateAccessToken } from '../../application/utils/tokenForAuth/generateToken';

jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'), // If you need to use other functions from jsonwebtoken
    verify: jest.fn(),
  }));
  
  jest.mock('../../application/utils/tokenForAuth/generateToken', () => ({
    generateAccessToken: jest.fn(),
  }));
  

describe('Auth Controller - refresh token function', () => {

    const refreshTokenSecretKey = 'test_refresh_secret_key'; // Use a test key
    const validRefreshToken = 'mock_valid_refresh_token';
    const expiredRefreshToken = 'mock_expired_refresh_token';
    const invalidRefreshToken = 'invalid_refresh_token';
    const userPayload = { id: '1', username: 'testuser' };
  
    
    beforeEach(() => {
    // Reset the mocks before each test
        jest.clearAllMocks();

        // Mock implementations for jwt.verify
        (jwt.verify as jest.Mock).mockImplementation((token, secret) => {
            if (token === validRefreshToken && secret === refreshTokenSecretKey) {
            return userPayload;
            } else if (token === expiredRefreshToken) {
            throw new jwt.TokenExpiredError('Token has expired', new Date());
            } else if (token === invalidRefreshToken) {
            throw new jwt.JsonWebTokenError('Invalid token');
            }
            throw new Error('Token cannot be verified');
        });

        // Mock implementation for generateAccessToken
        (generateAccessToken as jest.Mock).mockReturnValue('new_access_token');
        });

        it('should refresh an access token successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: validRefreshToken });

            expect(response.status).toBe(HttpStatusCode.OK);
            expect(response.body.accessToken).toBeDefined();
            expect(generateAccessToken).toHaveBeenCalledWith(userPayload);
        });

        it('should return a 400 status if the refresh token is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({}); // No refreshToken provided

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body.error).toBe('Refresh token is missing');
        });

        it('should return a 401 status if the refresh token has expired', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: expiredRefreshToken });

            expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
            expect(response.body.error).toBe('Token has expired');
        });

        it('should return a 401 status if the refresh token is invalid', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: invalidRefreshToken });

            expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
            expect(response.body.error).toBe('Invalid token');
        });

        it('should return a 500 status if there is an internal server error', async () => {
            // Simulate a server error
            (jwt.verify as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Internal Server Error');
                });

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: validRefreshToken });

            expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(response.body.error).toBe('Internal Server Error');
        });

});
