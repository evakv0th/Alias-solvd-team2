import { Server } from 'socket.io';
import isForbidden from './application/utils/wordChecker/wordChecker';
import badwordsArray from 'badwords/array';
import { chatService } from './services/chat.service';
import { userService } from './services/user.service';
import EventEmitter from 'events';
import { gameService } from './services/game.service';
import { roundService } from './services/round.service';
import { teamService } from './services/team.service';

export const eventEmitter = new EventEmitter();
let guessingWord: string;
let gameId: string;
let hostUsername: string;
let currentRoundId: string;
let currentChatId: string;

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', async ({ chatId, username }) => {
      (socket as any).username = username;

      currentChatId = chatId;
      if ((socket as any).username === hostUsername) {
        socket.emit('you are host', { guessingWord });
      }
      socket.join(chatId);
      console.log(`User ${username} joined chat ${chatId}`);
      try {
        const chat = await chatService.getById(chatId);
        if (chat.messages.length >= 50) {
          const chatRev = chat.messages.reverse().slice(0, 50).reverse();
          chatRev.forEach((message) => {
            socket.emit('chat message', `${message.message}`);
          });
        } else {
          chat.messages.forEach((message) => {
            socket.emit('chat message', `${message.message}`);
          });
        }
      } catch (error) {
        console.error('Error getting chat entity:', error);
      }
    });

    socket.on('leave', (chatId) => {
      socket.leave(chatId);
      console.log(`User left chat ${chatId}`);
    });

    eventEmitter.on('start round', async ({ chatId, randomWord, id, targetUser, roundId }) => {
      guessingWord = randomWord;
      gameId = id;
      hostUsername = targetUser;
      currentRoundId = roundId;
      io.to(chatId).emit('round started', { randomWord, id, targetUser, guessingWord, roundId });
    });

    eventEmitter.on('start round', async () => {
      const game = await gameService.getById(gameId);
      setTimeout(() => {
        roundService
          .getById(currentRoundId)
          .then(async (round) => {
            console.log(round.words, 'WORDS OBJECT!!!!');
            return gameService.handleFinishedRound(gameId, round);
          })
          .then(async () => {
            const game = await gameService.getById(gameId);
            const team1 = await teamService.getById(game.teams[0].teamId);
            const team2 = await teamService.getById(game.teams[1].teamId);
            console.log(team1.name, game.teams[0].score, team2.name, game.teams[1].score, `team scores`);

            if (game.teams[0].score >= game.options.goal && game.teams[1].score >= game.options.goal) {
              socket.to(currentChatId).emit('Round end', `${game.teams[0].score > game.teams[1].score ? team1.name : team2.name} WON in Clutch`);
            } else if (game.teams[0].score >= game.options.goal) {
              socket.to(currentChatId).emit('Round end', `${team1.name} WON`);
            } else if (game.teams[1].score >= game.options.goal) {
              socket.to(currentChatId).emit('Round end', `${team2.name} WON!!!`);
            } else {
              const { chatId, randomWord } = await gameService.start(gameId);
              console.log('Emitting "start round" event:', { chatId, randomWord, id: gameId });
              const currentTeam = await teamService.getById(game.currentTeam);
              socket
                .to(currentChatId)
                .emit('Round end', `Round ended! Now its time to guess for team ${currentTeam.name}. Link to the next chatId: ${chatId}`);
            }
          })
          .catch((error) => {
            console.error('Error starting round:', error);
          });
      }, game.options.roundTime * 1000);
    });

    socket.on('chat message', async (msg, chatId) => {
      const match = msg.match(/^([^:]+): (.+)$/);
      const username = match[1];
      const msgValue = match[2];
      console.log(`message: ${msgValue} from ${username} in chat ${chatId}`);

      try {
        console.log(currentRoundId, chatId);
        const chat = await chatService.getById(chatId);
        const user = await userService.getByUsername(username);
        const round = await roundService.getById(currentRoundId);
        const game = await gameService.getById(gameId);
        const currentTeam = await teamService.getById(game.currentTeam);
        const msgWithoutjunk = msgValue.replace(/[^a-zA-Z\s0-9]/g, '');
        const wordsToCheck = msgWithoutjunk.split(' ');

        let stateForMsgAdd = true;
        for (const word of wordsToCheck) {
          if (badwordsArray.includes(word)) {
            io.to(chatId).emit('chat message', `This message has been blocked (it contains inappropriate content).`);
            return;
          } else if (msgValue.startsWith('word is:')) {
            if (username === hostUsername) {
              io.to(chatId).emit('chat message', `Hosts cannot guess words! They only describe it.`);
              return;
            } else if (!currentTeam.members.includes(user._id as string)) {
              io.to(chatId).emit('chat message', `Only member from team ${currentTeam.name} can guess right now! Stop ${username}`);
              return;
            }
            const match = msgValue.match(/^word is: (.+)$/);
            const guessedWord = match ? match[1] : null;

            console.log(guessedWord);
            if (guessedWord?.toLowerCase() === guessingWord?.toLowerCase()) {
              io.to(chatId).emit('chat message', `Congratulations to ${username} for guessing the word -  ${guessedWord}!`);
              round.words.push({ word: guessingWord, guessed: true });
              await roundService.update(round);
              guessingWord = await gameService.getRandomWord(gameId);
              io.emit('update guessing word', { guessingWord });
              return;
            }
          } else if (isForbidden(guessingWord, word)) {
            io.to(chatId).emit('chat message', `This message has been blocked (it has similar word to guessedWord).`);
            stateForMsgAdd = false;
          }
        }
        if (stateForMsgAdd) {
          chat.messages.push({
            createdAt: new Date(),
            userId: user._id as string,
            message: msg,
          });

          await chatService.update(chat);

          io.to(chatId).emit('chat message', msg);
        }
      } catch (error) {
        console.error('Error updating chat entity:', error);
      }
    });

    socket.on('skip word', async (chatId) => {
      const round = await roundService.getById(currentRoundId);
      round.words.push({ word: guessingWord, guessed: false });
      await roundService.update(round);
      io.to(chatId).emit('chat message', `Guessing word was skipped - ${guessingWord}`);
      guessingWord = await gameService.getRandomWord(gameId);
      io.emit('update guessing word', { guessingWord });
    });
    socket.on('admin clear messages', async (chatId) => {
      try {
        const chat = await chatService.getById(chatId);
        chat.messages = [];
        await chatService.update(chat);

        io.to(chatId).emit('admin messages cleared');
      } catch (error) {
        console.error('Error clearing chat messages:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
