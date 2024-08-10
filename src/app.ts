import express, { NextFunction, urlencoded, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { errors } from 'celebrate';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66b77ebda740d39171199e9a' // '66b5ee44ea2b98aa4ec90e53'
  }
  next();
});

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errors());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({message: message, err: err});
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
