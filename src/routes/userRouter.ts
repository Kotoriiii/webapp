import express from 'express';
import userController from 'src/controller/userController';
import add405ResponseToRouter from 'src/utils/405Routes';
import {
  createUserMiddleware,
  updateUserMiddleware,
  basicAuthMiddleware,
  getUserMiddleware
} from 'src/middleware';

const router = express.Router();

router.post('/', createUserMiddleware, userController.createUsers);
router.put('/', basicAuthMiddleware, updateUserMiddleware, userController.updateUser);
router.get('/', basicAuthMiddleware, getUserMiddleware, userController.getUsers);

export default add405ResponseToRouter(router);
