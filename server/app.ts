import cors from 'cors';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import tweetsRoute from './router/tweet';
import authRoute from './router/auth';
import { config } from './config';
import { initSocket } from './connection/socket';
import { sequelize } from './db/database';

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
app.use('/auth', authRoute);

app.use((req, res) => {
	res.sendStatus(404);
});

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	res.sendStatus(500);
});

sequelize.sync().then(() => {
	const server = app.listen(config.host.port);
	initSocket(server);
});
