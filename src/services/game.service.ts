import {gameRepository} from "../repositories/game.repository";
import {IGame, IGameCreateSchema} from "../interfaces/game.interface";
import {vocabularyService} from "./vocabulary.service";
import {roundService} from "./round.service";
import {IRound, IRoundCreateSchema} from "../interfaces/round.interface";
import {chatService} from "./chat.service";
import {teamService} from "./team.service";
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import HttpException from '../application/utils/exceptions/http-exceptions';

class GameService {
  
  async getById(id: string): Promise<IGame> {
    try {
      return gameRepository.getById(id);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'game not found by id!',
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    return gameRepository.exists(id);
  }

  async create(game: IGameCreateSchema): Promise<string> {
    return gameRepository.create(game);
  }

  async update(game: IGame): Promise<IGame> {
    try {
      return gameRepository.update(game);
    } catch (error) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'game not found by id!',
      );
    }
  }
  async delete(id: string): Promise<void> {
    await gameRepository.delete(id);
  }

  async getRandomWord(id: string): Promise<string> {
    const game = await this.getById(id);
    const vocabulary = await vocabularyService.getById(game.options.vocabularyId);
    const uniquenessThreshold = vocabulary.words.length * 0.85;
    let word;
    do {
      word = vocabulary.words[Math.floor(Math.random() * vocabulary.words.length)];
    } while (await this.wordWasUsedInGame(word, game._id!, uniquenessThreshold))
    return word;
  }

  private async wordWasUsedInGame(word: string, gameId: string, threshold: number): Promise<boolean> {
    const rounds = await roundService.getAllByGameId(gameId);
    const wordsUsed = rounds.reduce((acc, round) => acc + round.words.length, 0);
    if (wordsUsed > threshold) {
      return false;
    }
    return rounds.some(round => round.words.map(obj => obj.word).includes(word));
  }

  async start(id: string) {
    await gameRepository.start(id);
    const game = await this.getById(id);
    const roundId = await this.createRound(game);
    game.rounds.push(roundId);
    await this.update(game);
    //TODO provide chat
  }

  private async createRound(game: IGame): Promise<string> {
    const roundId = await roundService.create({
      teamId: game.currentTeam,
      hostId: await this.getHostIdFromTeam(game.currentTeam, game._id!),
      chatId: await chatService.create(),
      finishedAt: this.getFinishDate(new Date(), game.options.roundTime),
      currentWord: await this.getRandomWord(game._id!)
    } as IRoundCreateSchema)
    return roundId;
  }

  async handleFinishedRound(id: string, round: IRound) {
    const game = await this.getById(id);
    let teamIndex = game.teams.findIndex(team => team.teamId === round.teamId);
    game.teams[teamIndex].score += this.getScoreFromRound(round);
    teamIndex = (teamIndex + 1) % game.teams.length;
    game.currentTeam = game.teams[teamIndex].teamId;
    await this.update(game);
  }

  private async getHostIdFromTeam(id: string, gameId: string): Promise<string> {
    const team = await teamService.getById(id);
    let rounds = await roundService.getAllByGameId(gameId);
    rounds = rounds.filter(round => round.teamId === id);
    return team.members[rounds.length % team.members.length];
  }

  private getFinishDate(startDate: Date, roundTime: number): Date {
    const finishDate = new Date(startDate);
    finishDate.setSeconds(finishDate.getSeconds() + roundTime);
    return finishDate;
  }

  private getScoreFromRound(round: IRound): number {
    return round.words.filter(word => word.guessed).length;
  }
  
}

export const gameService = new GameService();
