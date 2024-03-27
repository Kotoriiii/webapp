import { Response, Request } from 'express';
import { userService } from 'src/service';
import { userCreatePayloads, userUpdatePayloads } from 'src/types';
import { hashedPassword } from 'src/utils/encrypt';
import { sendResponse } from 'src/utils/sendResponse';
import { IRequest } from 'src/types';
import { publishMessage } from 'src/utils/publishMessage';
import sha256 from 'crypto-js/sha256';
import { userVerifyPayloads } from 'src/types/userType';

class UserController {
  async createUsers(req: Request, res: Response) {
    const data = req.body as userCreatePayloads;
    try {
      const hash = await hashedPassword(data.password);
      const verifyCode = sha256(data.username).toString();
      const wrapperData = { ...data, password: hash, verifyCode: verifyCode };
      const result = await userService.createUser(wrapperData);
      const { password, ...rest } = result;
      await publishMessage('verify_email', 'send verify_email', {
        id: result.id,
        email: result.username,
        verifyCode: verifyCode
      });
      res.statusCode = 201;
      res.statusMessage = 'User Created';
      sendResponse(res, rest, 'create user success');
    } catch (err) {
      res.statusCode = 503;
      sendResponse(res, err);
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = (req as IRequest).userInfo;
    try {
      let data = req.body as userUpdatePayloads;
      if (data.password) {
        const hash = await hashedPassword(data.password);
        data = { ...data, password: hash };
      }
      await userService.updateUser(data, id);
      res.sendStatus(204);
    } catch (err) {
      res.statusCode = 503;
      sendResponse(res, err);
    }
  }

  async getUsers(req: Request, res: Response) {
    const { id } = (req as IRequest).userInfo;
    try {
      const result = await userService.getUserById(id);
      res.statusCode = 200;
      sendResponse(res, result, 'get user success');
    } catch (err) {
      res.statusCode = 503;
      sendResponse(res, err);
    }
  }

  async verifyUsers(req: Request, res: Response) {
    const { id, code } = req.query;
    const paylod: userVerifyPayloads = {
      isVerify: true,
      account_updated: null
    };
    try {
      await userService.verifyUser(paylod, id as string, code as string);
      res.sendStatus(204);
    } catch (err) {
      res.statusCode = 503;
      sendResponse(res, err);
    }
  }
}

const userController = new UserController();

export default userController;
