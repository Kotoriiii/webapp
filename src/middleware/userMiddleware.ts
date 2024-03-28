import { Request, Response, NextFunction } from 'express';
import userService from 'src/service/user/userService';
import { sendResponse } from 'src/utils/sendResponse';
import { User } from '@prisma/client';
import { IRequest } from 'src/types';

const user = {
  id: '',
  first_name: '',
  last_name: '',
  password: '',
  username: '',
  account_created: null,
  account_updated: null
};

const payloadKeys = Object.keys(user);

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, first_name, last_name, id, account_created, account_updated } =
    req.body as User;

  if (id || account_created || account_updated) {
    res.statusCode = 400;
    sendResponse(res, null, 'body should not include id or account_created or account_updated');
    return;
  }

  if (!username || !password || !first_name || !last_name) {
    res.statusCode = 400;
    sendResponse(res, null, 'body must include username and password and first_name and last_name');
    return;
  }

  if (username.indexOf('@') === -1) {
    res.statusCode = 400;
    sendResponse(res, null, 'username must be a valid email address');
    return;
  }

  try {
    const result = await userService.getUserByUsername(username);
    if (result) {
      res.statusCode = 400;
      sendResponse(res, null, 'user is exist');
      return;
    }
  } catch (err) {
    res.statusCode = 503;
    sendResponse(res, err);
    return;
  }

  next();
};

export const updateUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const flag = Object.keys(req.body).some(key => payloadKeys.indexOf(key) === -1);

  if (flag) {
    res.statusCode = 400;
    sendResponse(res, null, 'invalid body parameter');
    return;
  }

  const { username, id, account_created, account_updated, password, first_name, last_name } =
    req.body as User;

  if (id || account_created || account_updated || username) {
    res.statusCode = 400;
    sendResponse(res, null, 'body cannot include id, account_created, account_updated');
    return;
  }

  if (!password && !first_name && !last_name) {
    res.statusCode = 400;
    sendResponse(res, null, 'incorrect body parameters');
    return;
  }

  next();
};

export const getUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.body).length !== 0) {
    res.statusCode = 400;
    sendResponse(res, null, 'cannot have body');
    return;
  }

  next();
};

export const verifyUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.id || !req.query.code) {
    res.statusCode = 400;
    sendResponse(res, null, 'params is not correct');
    return;
  }

  try {
    const result = await userService.getUserByIdCode(req.query.id as string, req.query.code as string);
    if (!result) {
      res.statusCode = 400;
      sendResponse(res, null, 'user is not found');
      return;
    }
    if (!result?.isSend) {
      res.statusCode = 400;
      sendResponse(res, null, 'email is not send');
      return;
    }
    const diff = new Date().getTime() - result.account_created!.getTime();
    if (diff / 1000 > 60) {
      res.statusCode = 400;
      sendResponse(res, null, 'verify email is expired');
      return;
    }
  } catch (err) {
    res.statusCode = 503;
    sendResponse(res, err);
    return;
  }

  next();
};

export const checkVerifyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userInfo } = req as IRequest;
  try {
    const result = await userService.getUserById(userInfo.id);
    if (!result?.isVerify) {
      res.statusCode = 403;
      sendResponse(res, null, 'user is not verified');
      return;
    }
  } catch (err) {
    res.statusCode = 503;
    sendResponse(res, err);
    return;
  }

  next();
};
