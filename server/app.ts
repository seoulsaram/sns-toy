import cors from 'cors';
import express, { Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetsRoute from './router/tweet';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use('/tweets', tweetsRoute);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error: any, req: any, res: Response<any, any>) => {
  console.error(error);
  res.sendStatus(500);
});

app.listen(8080);
