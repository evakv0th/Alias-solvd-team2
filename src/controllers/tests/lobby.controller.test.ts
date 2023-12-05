import request from 'supertest';
import app from '../..';
import { lobbyService } from '../../services/lobby.service';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';

jest.mock('../../services/lobby.service');

describe('LobbyController', () => {
    describe('createLobby', () => {
        it('should create a lobby successfully', async () => {
            const mockLobbyData = { hostId: 'host1', options: { someOption: 'value' }};
            const mockGameId = 'game123';

            (lobbyService.createLobby as jest.Mock).mockResolvedValue(mockGameId);

            const response = await request(app)
                .post('/api/v1/lobby/create')
                .send(mockLobbyData);

            expect(response.status).toBe(HttpStatusCode.CREATED);
            expect(response.body).toEqual({ gameId: mockGameId });
        });

        it('should handle errors properly', async () => {
            const mockLobbyData = { hostId: 'host1', options: { someOption: 'value' }};
            const errorMessage = 'Error creating lobby';

            (lobbyService.createLobby as jest.Mock).mockRejectedValue(new Error(errorMessage));

            const response = await request(app)
                .post('/api/v1/lobby/create')
                .send(mockLobbyData);

            expect(response.status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual({ message: 'Internal server error' });
        });
    });

    describe('joinLobby', () => {
        it('should allow a user to join a lobby successfully', async () => {
            const userId = 'user123';
            const gameId = 'game123';
            const mockGame = { id: gameId, teams: [{ teamId: 'team123', members: [userId] }] };
        
            (lobbyService.joinLobby as jest.Mock).mockResolvedValue(mockGame);
        
            const response = await request(app)
                .post(`/api/v1/lobby/join/${gameId}`)
                .send({ userId });
        
            expect(response.status).toBe(HttpStatusCode.OK);
            expect(response.body).toEqual(mockGame);
        });
        
    
        it('should handle errors when joining a lobby', async () => {
            const userId = 'user123';
            const gameId = 'invalidGameId';
            const errorMessage = 'Lobby not found';
    
            (lobbyService.joinLobby as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, errorMessage));
    
            const response = await request(app)
                .post(`/api/v1/lobby/join/${gameId}`)
                .send({ userId });
    
            expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
            expect(response.body).toEqual({ message: errorMessage });
        });
    });

    describe('selectTeam', () => {
        it('should allow a user to select a team successfully', async () => {
            const userId = 'user123';
            const gameId = 'game123';
            const teamId = 'team123';
            const mockGame = { id: gameId, teams: [{ teamId: teamId, members: [userId] }] };
        
            (lobbyService.selectTeam as jest.Mock).mockResolvedValue(mockGame);
        
            const response = await request(app)
                .put(`/api/v1/lobby/selectTeam/${gameId}`)
                .send({ gameId, userId, teamId });
        
            expect(response.status).toBe(HttpStatusCode.OK);
            expect(response.body).toEqual(mockGame);
        });
        
    
        it('should handle errors when selecting a team', async () => {
            const userId = 'user123';
            const gameId = 'game123';
            const teamId = 'invalidTeamId';
            const errorMessage = 'Team not found';
    
            (lobbyService.selectTeam as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, errorMessage));
    
            const response = await request(app)
                .put(`/api/v1/lobby/selectTeam/${gameId}`)
                .send({ userId, teamId });
    
            expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
            expect(response.body).toEqual({ message: errorMessage });
        });
    });

    describe('leaveLobby', () => {
        it('should allow a user to leave the lobby successfully', async () => {
            const userId = 'user123';
            const gameId = 'game123';
            const mockGame = { id: gameId, players: [] };
    
            (lobbyService.leaveLobby as jest.Mock).mockResolvedValue(mockGame);
    
            const response = await request(app)
                .post(`/api/v1/lobby/leave/${gameId}`)
                .send({ userId });
    
            expect(response.status).toBe(HttpStatusCode.OK);
            expect(response.body).toEqual(mockGame);
        });
    
        it('should handle errors when leaving the lobby', async () => {
            const userId = 'user123';
            const gameId = 'invalidGameId';
            const errorMessage = 'Lobby not found';
    
            (lobbyService.leaveLobby as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, errorMessage));
    
            const response = await request(app)
                .post(`/api/v1/lobby/leave/${gameId}`)
                .send({ userId });
    
            expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
            expect(response.body).toEqual({ message: errorMessage });
        });
    });
});
