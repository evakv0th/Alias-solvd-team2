import { Server } from 'socket.io';
import isForbidden from './application/utils/wordChecker/wordChecker';
import badwordsArray from 'badwords/array';
import { chatService } from './services/chat.service';
import { userService } from './services/user.service';
import EventEmitter from 'events';
import { gameService } from './services/game.service';

export const eventEmitter = new EventEmitter();
let guessingWord: string;
let gameId: string;
let hostUsername: string;

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', async ({ chatId, username }) => {
      (socket as any).username = username;

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

    eventEmitter.on('start round', ({ chatId, randomWord, id, targetUser }) => {
      guessingWord = randomWord;
      gameId = id;
      hostUsername = targetUser;
      io.to(chatId).emit('round started', { randomWord, id, targetUser, guessingWord });
    });
    socket.on('chat message', async (msg, chatId) => {
      const match = msg.match(/^([^:]+): (.+)$/);
      const username = match[1];
      const msgValue = match[2];
      console.log(`message: ${msgValue} from ${username} in chat ${chatId}`);

      try {
        const chat = await chatService.getById(chatId);
        const user = await userService.getByUsername(username);
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
            }
            const match = msgValue.match(/^word is: (.+)$/);
            const guessedWord = match ? match[1] : null;

            console.log(guessedWord);
            if (guessedWord?.toLowerCase() === guessingWord?.toLowerCase()) {
              io.to(chatId).emit('chat message', `Congratulations to ${username} for guessing the word -  ${guessedWord}!`);
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
