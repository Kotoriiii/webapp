import { Prisma } from '@prisma/client';
import { userCreatePayloads, userUpdatePayloads } from 'src/types';

export const createValidator = (user: userCreatePayloads) => {
  return Prisma.validator<Prisma.UserCreateInput>()({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    password: user.password,
    account_created: new Date(),
    account_updated: new Date()
  });
};

export const getByUsernameValidator = (username: string) => {
  return Prisma.validator<Prisma.UserWhereUniqueInput>()({
    username
  });
};

export const updateByIdValidator = (id: string) => {
  return Prisma.validator<Prisma.UserWhereUniqueInput>()({
    id
  });
};

export const updateUserValidator = (user: userUpdatePayloads) => {
  return Prisma.validator<Prisma.UserUpdateInput>()({
    first_name: user.first_name,
    last_name: user.last_name,
    password: user.password,
    account_updated: new Date()
  });
};

export const getByIdValidator = (id: string) => {
  return Prisma.validator<Prisma.UserWhereUniqueInput>()({
    id
  });
};
