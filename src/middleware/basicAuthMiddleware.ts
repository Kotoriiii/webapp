import basicAuth from 'basic-auth';
import { Request, Response, NextFunction } from 'express';
import { userService } from 'src/service';
import { sendResponse } from 'src/utils/sendResponse';
import { isMatch } from '../utils/encrypt';
import { IRequest } from 'src/types';

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const credentials = basicAuth(req);
  try {
    if (credentials) {
      const result = await userService.getUserByUsername(credentials.name);
      if (!result) {
        res.statusCode = 401;
        sendResponse(res, null, 'user account does not exist');
        return;
      }

      const match = await isMatch(credentials.pass, result.password);
      if (!match) {
        res.statusCode = 401;
        sendResponse(res, null, 'password is not correct');
        return;
      }

      (req as IRequest).userInfo = {
        id: result.id
      };
    } else {
      res.statusCode = 401;
      sendResponse(res, null, 'Invalid credentials');
      return;
    }
  } catch (err) {
    res.statusCode = 503;
    sendResponse(res, err);
    return;
  }

  next();
};
