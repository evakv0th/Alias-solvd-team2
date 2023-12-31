import {gameRepository} from '../repositories/game.repository';
import {IGame, IGameCreateSchema} from '../interfaces/game.interface';
import {vocabularyService} from './vocabulary.service';
import {roundService} from './round.service';
import {IRound, IRoundCreateSchema} from '../interfaces/round.interface';
import {chatService} from './chat.service';
import {teamService} from './team.service';
import {userService} from "./user.service";
import HttpException from "../application/utils/exceptions/http-exceptions";
import HttpStatusCode from "../application/utils/exceptions/statusCode";

export class GameService {

  async getById(id: string): Promise<IGame> {
    return gameRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return gameRepository.exists(id);
  }

  async create(game: IGameCreateSchema): Promise<string> {
    const hostExists = await userService.exists(game.hostId);
    if (!hostExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Host of game is not found.");
    }
    const vocabularyExists = await vocabularyService.exists(game.options.vocabularyId);
    if (!vocabularyExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, "Vocabulary of game is not found.");
    }
    if (game.options.roundTime <= 0) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "Round time can't be negative.");
    }
    if (game.options.goal <= 0) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "Goal of game can't be negative.");
    }
    for (const teamId of game.teams) {
      const teamExists = await teamService.exists(teamId);
      if (!teamExists) {
        throw new HttpException(HttpStatusCode.NOT_FOUND, `Team ${teamId} is not found.`);
      }
    }
    return gameRepository.create(game);
  }

  async update(game: IGame): Promise<IGame> {
    const teamExists = await teamService.exists(game.currentTeam);
    if (!teamExists) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, `Team ${game.currentTeam} is not found.`);
    }
    for (const team of game.teams) {
      const teamExists = await teamService.exists(team.teamId);
      if (!teamExists) {
        throw new HttpException(HttpStatusCode.NOT_FOUND, `Team ${team.teamId} is not found.`);
      }
    }
    for (const roundId of game.rounds) {
      const roundExists = await roundService.exists(roundId);
      if (!roundExists) {
        throw new HttpException(HttpStatusCode.NOT_FOUND, `Round ${roundId} is not found.`);
      }
    }
    return gameRepository.update(game);
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

  async start(id: string): Promise<string> {
    await gameRepository.start(id);
    const game = await this.getById(id);
    const { roundId, chatId } = await this.createRound(game);
    game.rounds.push(roundId);
    await this.update(game);
    return chatId
  }

  private async createRound(game: IGame): Promise<{ roundId: string; chatId: string }> {
    const chatId = await chatService.create();
    const hostId = await this.getHostIdFromTeam(game.currentTeam, game._id!);
    const randomWord = await this.getRandomWord(game._id!);
    const roundId = await roundService.create({
      teamId: game.currentTeam,
      hostId: hostId,
      chatId: chatId,
      finishedAt: this.getFinishDate(new Date(), game.options.roundTime),
      currentWord: randomWord,
    } as IRoundCreateSchema);
    await userService.incrementRoundsPlayed(hostId);
    return { roundId, chatId };
  }

  async handleFinishedRound(id: string, round: IRound) {
    const game = await this.getById(id);
    let teamIndex = game.teams.findIndex((team) => team.teamId === round.teamId);
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
    return round.words.filter((word) => word.guessed).length;
  }

  async hasAccess(id: string, userId: string): Promise<boolean> {
    const game = await gameService.getById(id);
    if (game.hostId === userId) {
      return true;
    }
    const teams = await teamService.getAllByGameId(id);
    return teams.some(team => team.members.includes(userId));
  }

}

export const gameService = new GameService();
