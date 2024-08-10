import { getUsers } from "controllers/users";
import { Request, Response, Router } from "express";

const router = Router();

router.all('*', (_req: Request, res: Response) => {
  res.status(404).send({message: 'Такой маршрут мы не обрабатываем :pepe_sad:'});
});

export default router;