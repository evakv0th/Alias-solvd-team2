import request from 'supertest';
import * as authService from '../../services/auth.service';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import app, { closeServer, startServer } from '../..';
import * as jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../application/utils/tokenForAuth/generateToken';

jest.mock('../../services/auth.service');
jest.mock('jsonwebtoken');
jest.mock('../../application/utils/tokenForAuth/generateToken', () => ({
    ...jest.requireActual('../../application/utils/tokenForAuth/generateToken'),
    generateAccessToken: jest.fn(),
}));


describe('Auth Controller', () => {
    describe('Auth Controller - register function', () => {

        beforeAll(async () => {
            await startServer(); 
        });
  
        afterAll(async () => {
            await closeServer(); 
        });
        
        it('should register a new user successfully', async () => {
            const mockUser = { username: 'testuser', password: 'password' };
            (authService.register as jest.Mock).mockResolvedValue({ user: mockUser });

            const response = await request(app)
            .post('/api/v1/auth/register')
            .send(mockUser);

            expect(response.status).toBe(HttpStatusCode.CREATED);
            expect(response.body.message).toBe('User registered successfully');
        });

        it('should return a 400 status if the user already exists', async () => {
            const mockUser = { username: 'testuser', password: 'password' };
            const errorMessage = 'User already exists';
            (authService.register as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.BAD_REQUEST, errorMessage));

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(mockUser);

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body.error).toBe(errorMessage);
        });

        it('should return a 400 status if the request data is invalid', async () => {
            const errorMessage = 'Missing username in body request';
            (authService.register as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.BAD_REQUEST, errorMessage));

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({ username: '', password: 'password' }); 

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body.error).toBe(errorMessage);
        });
        
        it('should return a 500 status if there is a server error', async () => {
            const mockUser = { username: 'testuser', password: 'password' };
            const errorMessage = 'Internal Server Error';
            (authService.register as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(mockUser);

            expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(response.body.error).toBe(errorMessage);
        });
  
    });

    describe('Auth Controller - login function', () => {

        beforeAll(async () => {
            await startServer(); 
        });

        afterAll(async () => {
            await closeServer(); 
        });
          
        const mockUserCredentials = { username: 'testuser', password: 'password' };
        const mockAuthResponse = { accessToken: 'access-token', refreshToken: 'refresh-token' };
    
        it('should log in a user successfully and return tokens', async () => {
            (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);
        
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(mockUserCredentials);
        
            expect(response.status).toBe(HttpStatusCode.OK);
            expect(response.body.accessToken).toBe(mockAuthResponse.accessToken);
            expect(response.body.refreshToken).toBe(mockAuthResponse.refreshToken);
        });
    
        it('should return a 401 status when the credentials are incorrect', async () => {
            const errorMessage = 'Invalid credentials';
            (authService.login as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.UNAUTHORIZED, errorMessage));
        
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({ username: 'wronguser', password: 'wrongpassword' });
        
            expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
            expect(response.body.error).toBe(errorMessage);
        });
    
        it('should return a 500 status when there is a server error', async () => {
            const errorMessage = 'Internal Server Error';
            (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(mockUserCredentials);
        
            expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(response.body.error).toBe(errorMessage);
        });

    });

    describe('Auth Controller - refresh function', () => {
        beforeAll(async () => {
            await startServer(); 
        });

        afterAll(async () => {
            await closeServer(); 
        });

        const refreshToken = 'valid-refresh-token';

        it('should refresh access token successfully', async () => {
            const newAccessToken = 'new-access-token';
            const decodedToken = { id: 'user-id', username: 'user' };

            jest.spyOn(jwt, 'verify').mockImplementation((token, secretOrPublicKey) => {
                if (token === 'valid-refresh-token') {
                    return { id: 'user-id', username: 'user' }; 
                } else {
                    throw new jwt.JsonWebTokenError('Invalid token');
                }
            });

            (generateAccessToken as jest.Mock).mockReturnValue(newAccessToken);

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken });

            expect(response.status).toBe(HttpStatusCode.OK);
            expect(response.body.accessToken).toBe(newAccessToken);
        });

        it('should return a 400 status if refresh token is missing', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({});

            expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
            expect(response.body.error).toBe('Refresh token is missing');
        });

        it('should return a 401 status if the token has expired', async () => {
            jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw new jwt.TokenExpiredError('Token expired', new Date());
            });

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken });

            expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
            expect(response.body.error).toBe('Token has expired');
        });

        it('should return a 401 status if the token is invalid', async () => {
            jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw new jwt.JsonWebTokenError('Invalid token');
            });

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken });

            expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
            expect(response.body.error).toBe('Invalid token');
        });

        it('should return a 500 status for internal server error', async () => {
            jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw new Error('Internal Server Error');
            });

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken });

            expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(response.body.error).toBe('Internal Server Error');
        });
    });

});

  
