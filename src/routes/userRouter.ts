import express from 'express';
import userController from 'src/controller/userController';
import add405ResponseToRouter from 'src/utils/405Routes';
import {
  createUserMiddleware,
  updateUserMiddleware,
  basicAuthMiddleware,
  getUserMiddleware
} from 'src/middleware';
import { verifyUserMiddleware } from 'src/middleware/userMiddleware';
import { checkVerifyUserMiddleware } from '../middleware/userMiddleware';

const router = express.Router();

router.post('/', createUserMiddleware, userController.createUsers);
router.put(
  '/',
  basicAuthMiddleware,
  checkVerifyUserMiddleware,
  updateUserMiddleware,
  userController.updateUser
);
router.get(
  '/self',
  basicAuthMiddleware,
  checkVerifyUserMiddleware,
  getUserMiddleware,
  userController.getUsers
);
router.get('/verify', verifyUserMiddleware, userController.verifyUsers);

export default add405ResponseToRouter(router);
