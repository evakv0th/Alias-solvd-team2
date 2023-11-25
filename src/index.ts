import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.router';
import { couchdbInit } from './couchdb.init';
import http from 'http';
import { Server } from 'socket.io';
import chatRouter from './routes/chat.router';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle joining a specific chat room
  socket.on('join', (chatId: string) => {
    socket.join(chatId);
    console.log(`User joined chat ${chatId}`);
  });

  // Handle leaving a chat room (optional)
  socket.on('leave', (chatId: string) => {
    socket.leave(chatId);
    console.log(`User left chat ${chatId}`);
  });

  // Handle chat messages within a specific room
  socket.on('chat message', (msg, chatId) => {
    console.log(`message: ${msg} in chat ${chatId}`);
    io.to(chatId).emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
}); 

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chats', chatRouter);
const startServer = async (): Promise<void> => {
  couchdbInit().then(() => {
    server.listen(port, () => {
      console.log(`Server started at Port ${port}`);
    });
  });
};

startServer();
