import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createUser, getUserById, getUsers, updateUser, updateUserAvatar,
} from '../controllers/users';

const router = Router();

const celebrateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    avatar: Joi.string().required(),
  }),
});

router.post('/', celebrateUserInfo, createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', celebrateUserInfo, updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

export default router;