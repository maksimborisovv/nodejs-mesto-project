import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUserById, getUserByTokenId, getUsers, updateUser, updateUserAvatar,
} from '../controllers/users';
import { urlRegex } from '../models/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserByTokenId);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
}), updateUserAvatar);

export default router;
