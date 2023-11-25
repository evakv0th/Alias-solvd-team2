import dotenv from 'dotenv';
import http from 'http'; 
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth.router';
import {couchdbInit} from "./couchdb.init";


dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Alias project!');
});

app.use('/api/v1/auth', authRouter);

let server: http.Server; 

const startServer = async (): Promise<void> => {
  couchdbInit().then(() => {
    // app.listen(port, () => {
    //   console.log(`Server started at Port ${port}`);
    // });
    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => console.log(`Server started at Port ${port}`))
    }
  });
};

const closeServer = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (server) {
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
      resolve(); // Resolve immediately if the server isn't set
    }
  });
};
startServer();

export { app, startServer, closeServer };
