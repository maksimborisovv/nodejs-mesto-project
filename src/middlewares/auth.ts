import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const UnauthorizedError = require('../errors/unauthorized');

require('dotenv').config();

const { JWT_SECRET = 'some-secret-key' } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = { _id: payload };

  next();
};
