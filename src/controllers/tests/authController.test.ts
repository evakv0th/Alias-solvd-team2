import request from 'supertest';
import app from '../../index'; 
import * as authService from '../../services/auth.service';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../application/utils/tokenForAuth/generateToken';
import * as tokenForAuth from '../../application/utils/tokenForAuth/generateToken';


jest.mock('../../services/auth.service');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    describe('register function', () => {
        it('should register a new user successfully', async () => {
            const mockUser = { username: 'testuser', password: 'password' };
            (authService.register as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
            .post('/api/v1/auth/register')
            .send(mockUser);

            expect(response.status).toBe(HttpStatusCode.CREATED);
            expect(response.body.user).toEqual(mockUser);
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
            const errorMessage = 'Invalid registration data';
            (authService.register as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.BAD_REQUEST, errorMessage));

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({ username: '', password: 'password' }); // Invalid data example

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
});

  
