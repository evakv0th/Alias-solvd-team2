import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.router';
import { couchdbInit } from './couchdb.init';
import http from 'http';
import { Server } from 'socket.io';
import chatRouter from './routes/chat.router';
import path from 'path';
import { setupSocket } from './socketSetup';
import cookieParser from 'cookie-parser';
import lobbyRouter from './routes/lobby.router';
import teamRouter from './routes/team.router';
import userRouter from './routes/user.router';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.set('view engine', 'ejs'); // for ejs
app.set('views', path.join(__dirname, 'views/src/views')); // for ejs
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views/src/views')); // for css to work

app.get('/', (req: Request, res: Response) => {
  res.sendFile('Alias game');
});

setupSocket(io);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/lobby', lobbyRouter);
app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/users', userRouter);

const startServer = async (): Promise<void> => {
  couchdbInit().then(() => {
    server.listen(port, () => {
      console.log(`Server started at Port ${port}`);
    });
  });
};

startServer();
