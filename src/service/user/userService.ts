import prisma from 'src/db';
import { userCreatePayloads, userUpdatePayloads } from 'src/types';
import {
  createValidator,
  getByIdValidator,
  getByUsernameValidator,
  updateByIdValidator,
  updateUserValidator
} from './validator';

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
        account_created: true,
        account_updated: true
      }
    });
  }
}

const userService = new UserService();

export default userService;
