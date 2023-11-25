import { gameRepository } from "../../repositories/game.repository";
import { gameService } from "../game.service";


// Mock the gameRepository.getById function
jest.mock("../../repositories/game.repository", () => ({
  gameRepository: {
    getById: jest.fn(),
  },
}));

describe("GameService", () => {
  describe("getById", () => {
    it("should return a game when a valid id is provided", async () => {
      // Arrange
      const gameId = "some-game-id";
      const expectedGame = {
        _id: gameId,
      };
      (gameRepository.getById as jest.Mock).mockResolvedValue(expectedGame);

      const game = await gameService.getById(gameId);

      expect(game).toEqual(expectedGame);
      expect(gameRepository.getById).toHaveBeenCalledWith(gameId);
    });
  });

});