import prisma from 'src/db';
import { userCreatePayloads, userUpdatePayloads } from 'src/types';
import {
  createValidator,
  getByIdCodeValidator,
  getByIdValidator,
  getByUsernameValidator,
  updateByIdCodeValidator,
  updateByIdValidator,
  updateUserValidator,
  verifyUserValidator
} from './validator';
import { userVerifyPayloads } from 'src/types/userType';

class UserService {
  createUser(user: userCreatePayloads) {
    return prisma.user.create({
      data: createValidator(user)
    });
  }

  getUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: getByUsernameValidator(username)
    });
  }

  updateUser(user: userUpdatePayloads, id: string) {
    return prisma.user.update({
      where: updateByIdValidator(id),
      data: updateUserValidator(user)
    });
  }

  getUserById(id: string) {
    return prisma.user.findUnique({
      where: getByIdValidator(id),
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        isSend: true,
        isVerify: true,
        account_created: true,
        account_updated: true
      }
    });
  }

  getUserByIdCode(id: string, code: string) {
    return prisma.user.findUnique({
      where: getByIdCodeValidator(id, code),
      select: {
        id: true,
        isSend: true,
        account_created: true
      }
    });
  }

  verifyUser(user: userVerifyPayloads, id: string, code: string) {
    return prisma.user.update({
      where: updateByIdCodeValidator(id, code),
      data: verifyUserValidator(user)
    });
  }
}

const userService = new UserService();

export default userService;
