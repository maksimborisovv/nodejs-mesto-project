import express, { NextFunction, urlencoded, Request, Response } from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import auth from './middlewares/auth';
import doesNotExistsRouter from './routes/does-not-exists';
import { errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(requestLogger);

app.use('/', authRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(doesNotExistsRouter);

app.use(errorLogger);

app.use(errors());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({message: message, err: err});
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
