import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';

const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request');

export const createCard = (req: Request, res: Response, next: NextFunction) => Card.create({
  name: req.body.name,
  link: req.body.link,
  owner: req.user?._id,
})
  .then((card) => res.status(201).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else {
      next(err);
    }
  });

export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find()
  .then((cards) => res.send(cards))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else {
      next(err);
    }
  });

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => Card
  .findById(req.params.cardId)
  .then((c) => {
    if (!c) {
      throw new NotFoundError('Карточка с таким id не существует');
    }

    Card.findByIdAndDelete(req.params.cardId)
      .then((card) => res.send(card));
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else {
      next(err);
    }
  });

export const putLike = (req: Request, res: Response, next: NextFunction) => Card
  .findById(req.params.cardId)
  .then((c) => {
    if (!c) {
      throw new NotFoundError('Карточка с таким id не существует');
    }

    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    )
      .then((card) => res.send(card));
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Данные не прошли валидацию'));
    } else {
      next(err);
    }
  });

export const deleteLike = (req: Request, res: Response, next: NextFunction) => (
  Card.findById(req.params.cardId)
    .then((c) => {
      if (!c) {
        throw new NotFoundError('Карточка с таким id не существует');
      }

      Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user?._id } },
        { new: true },
      )
        .then((card) => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные не прошли валидацию'));
      } else {
        next(err);
      }
    })
);
