import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

require('dotenv').config();

const { JWT_SECRET = 'some-secret-key' } = process.env;

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request');
const ConfictError = require('../errors/conflict');

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findOne({ email: req.body.email })
  .then((user) => {
    if (user) {
      throw new ConfictError('Пользователь с таким email уже существует');
    }

    return bcrypt.hash(req.body.password, 10);
  })
  .then((hash) => User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: hash,
  }))
  .then((user) => res.status(201).send({
    _id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
  }))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else if (err.code === 11000) {
      throw new ConfictError('Пользователь с таким email уже существует');
    } else {
      next(err);
    }
  });

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find()
  .then((users) => res.send(
    users.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    })),
  ))
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else {
      next(err);
    }
  });

export const getUserById = (req: Request, res: Response, next: NextFunction) => (
  User.findById({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не существует');
      }

      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Данные не прошли валидацию'));
      } else {
        next(err);
      }
    })
);

export const updateUser = (req: Request, res: Response, next: NextFunction) => (
  User.findById(req.user?._id)
    .then((u) => {
      if (!u) {
        throw new NotFoundError('Пользователь с таким id не существует');
      }

      return User.findByIdAndUpdate(req.user?._id, {
        name: req.body.name,
        about: req.body.about,
      }, { new: true, runValidators: true }).then((user) => res.send(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Данные не прошли валидацию'));
      } else {
        next(err);
      }
    })
);

export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.user?._id)
  .then((u) => {
    if (!u) {
      throw new NotFoundError('Пользователь с таким id не существует');
    }

    return User.findByIdAndUpdate(req.user?._id, {
      avatar: req.body.avatar,
    }, { new: true, runValidators: true }).then((user) => res.send(user));
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else {
      next(err);
    }
  });

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};
