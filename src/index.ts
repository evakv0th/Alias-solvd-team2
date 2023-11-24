import dotenv from 'dotenv';
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
const startServer = async (): Promise<void> => {
  app.listen(port, () => {
    console.log(`Server started at Port ${port}`);
  });
};

couchdbInit();

startServer();