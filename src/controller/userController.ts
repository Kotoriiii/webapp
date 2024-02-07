import { Response, Request } from 'express';
import { userService } from 'src/service';
import { userCreatePayloads, userUpdatePayloads } from 'src/types';
import { hashedPassword } from 'src/utils/encrypt';
import { sendResponse } from 'src/utils/sendResponse';
import { IRequest } from 'src/types';

class UserController {
  async createUsers(req: Request, res: Response) {
    const data = req.body as userCreatePayloads;
    try {
      const hash = await hashedPassword(data.password);
      const wrapperData = { ...data, password: hash };
      const result = await userService.createUser(wrapperData);
      const { password, ...rest } = result;
      res.statusCode = 201;
      res.statusMessage = 'User Created';
      sendResponse(res, data, 'create user success');
    } catch (err) {
      res.statusCode = 503;
      sendResponse(res, err);
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = (req as IRequest).userInfo;
    const data = req.body as userUpdatePayloads;
    try {
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

  // async getAllUsers(req: Request, res: Response) {
  //   try {
  //     const result = await userService.getAllUsers();
  //     res.statusCode = 200;
  //     sendResponse(res, result, 'get user success');
  //   } catch (err) {
  //     res.statusCode = 503;
  //     sendResponse(res, err);
  //   }
  // }
}

const userController = new UserController();

export default userController;
