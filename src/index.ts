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
import gameRouter from './routes/game.router';
import vocabularyRouter from './routes/vocabulary.router';
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
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vocabularies', vocabularyRouter);

export default app;

export const startServer = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    return new Promise((resolve, reject) => {
      couchdbInit().then(() => {
        server.listen(port, () => {
          console.log(`Server started at Port ${port}`);
          resolve();
        });
      }).catch(reject);
    });
  } else {
    console.log('Server start skipped in test environment');
    return Promise.resolve();
  }
};

export const closeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server.listening) {
      server.close((err) => {
        if (err) {
          console.error('Failed to close the server', err);
          reject(err);
        } else {
          console.log('Server closed');
          resolve();
        }
      });
    } else {
      console.log('Server was not running');
      resolve();
    }
  });
};


startServer();
