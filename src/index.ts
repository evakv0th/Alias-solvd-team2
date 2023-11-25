import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.router';
import { couchdbInit } from './couchdb.init';
import http from 'http';
import { Server } from 'socket.io';
import chatRouter from './routes/chat.router';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

io.emit('some event', {
  someProperty: 'some value',
  otherProperty: 'other value',
});
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
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
