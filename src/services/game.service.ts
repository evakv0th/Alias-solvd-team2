import {gameRepository} from "../repositories/game.repository";
import {IGame, IGameCreateSchema} from "../interfaces/game.interface";
import {vocabularyService} from "./vocabulary.service";
import {roundService} from "./round.service";
import {IRound, IRoundCreateSchema} from "../interfaces/round.interface";
import {chatService} from "./chat.service";
import {teamService} from "./team.service";

class GameService {

  async getById(id: string): Promise<IGame> {
    return gameRepository.getById(id);
  }

  async exists(id: string): Promise<boolean> {
    return gameRepository.exists(id);
  }

  async create(game: IGameCreateSchema): Promise<string> {
    return gameRepository.create(game);
  }

  async update(game: IGame): Promise<IGame> {
    return gameRepository.update(game);
  }

  async delete(id: string) {
    await gameRepository.delete(id);
  }

  async getRandomWord(id: string): Promise<string> {
    const game = await this.getById(id);
    const vocabulary = await vocabularyService.getById(game.options.vocabularyId);
    let word;
    do {
      word = vocabulary.words[Math.floor(Math.random() * vocabulary.words.length)];
    } while (await this.wordWasUsedInGame(word, game._id!))
    return word;
  }

  private async wordWasUsedInGame(word: string, gameId: string): Promise<boolean> {
    const rounds = await roundService.getAllByGameId(gameId);
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
    rounds = rounds.filter(round => round.teamId = id);
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