import { Server } from 'socket.io';
import { chatRepository } from './repositories/chat.repository';
import { WordChecker } from './application/utils/wordChecker/wordChecker';
// import { userRepository } from './repositories/user.repository';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', async (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat ${chatId}`);
      try {
        const chat = await chatRepository.getById(chatId);

        chat.messages.forEach((message) => {
          socket.emit('chat message', `${message.message}`);
        });
      } catch (error) {
        console.error('Error getting chat entity:', error);
      }
    });

    socket.on('leave', (chatId) => {
      socket.leave(chatId);
      console.log(`User left chat ${chatId}`);
    });

    socket.on('chat message', async (msg, chatId) => {
      console.log(`message: ${msg} in chat ${chatId}`);

      try {
        const chat = await chatRepository.getById(chatId);
        // const user = await userRepository.getById(
        //   '0d81332b4945a796c42abb425e000e66',
        // );
        const msgWithoutjunk = msg.replace(/[^a-zA-Z\s]/g, '');
        const wordsToCheck = msgWithoutjunk.split(' ');
        const wordToCheck = 'happy';
        let stateForMsgAdd = true;
        for (const word of wordsToCheck) {
          if (WordChecker.isMessageValid(msg, wordToCheck)){
            console.error(`you cant use words like ${word}. Its almost same as guessed words`);
            stateForMsgAdd = false;
          }
        }
        if (stateForMsgAdd) {
          chat.messages.push({
            createdAt: new Date(),
            userId: 'test',
            message: msg,
          });

          await chatRepository.update(chat);

          io.to(chatId).emit('chat message', msg);
        }
      } catch (error) {
        console.error('Error updating chat entity:', error);
      }
    });

    socket.on('admin clear messages', async (chatId) => {
      try {
        const chat = await chatRepository.getById(chatId);
        chat.messages = [];
        await chatRepository.update(chat);

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
