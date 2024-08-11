import { NextFunction, Request, Response, Router } from 'express';

const NotFoundError = require('../errors/not-found-error');

const router = Router();

router.all('*', (_req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Такой маршрут мы не обрабатываем :pepe_sad:'));
});

export default router;
