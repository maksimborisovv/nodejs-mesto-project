import { NextFunction, Request, Response } from 'express';
import User from '../models/user';

const NotFoundError = require('../errors/not-found-error');

export const createUser = (req: Request, res: Response, next: NextFunction) => User.create({
  name: req.body.name,
  about: req.body.about,
  avatar: req.body.avatar,
})
  .then((user) => res.status(201).send({
    _id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
  }))
  .catch(next);

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find()
  .then((users) => res.send(
    users.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    })),
  ))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => User.findById({ _id: req.params.userId })
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
  .catch(next);

export const updateUser = (req: Request, res: Response, next: NextFunction) => User.findById(req.user?._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с таким id не существует');
    }

    return User.findByIdAndUpdate(req.user?._id, {
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }).then((user) => res.send(user));
  })
  .catch(next);

export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.user?._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с таким id не существует');
    }

    return User.findByIdAndUpdate(req.user?._id, {
      avatar: req.body.avatar,
    })
      .then((user) => res.send(user));
  })
  .catch(next);
