import { Server } from 'socket.io';
import { chatRepository } from './repositories/chat.repository';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', async (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat ${chatId}`);
      try {
        const chat = await chatRepository.getById(chatId);

        chat.messages.forEach((message) => {
          socket.emit('chat message', `${message.userId}: ${message.message}`);
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
        chat.messages.push({
          createdAt: new Date(),
          userId: 'testUserId',
          message: msg,
        });
        await chatRepository.update(chat);

        io.to(chatId).emit('chat message', `testUserId: ${msg}`);
      } catch (error) {
        console.error('Error updating chat entity:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
