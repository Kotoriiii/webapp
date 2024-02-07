import { Prisma } from '@prisma/client';

const userCreateTypes = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    first_name: true,
    last_name: true,
    password: true,
    username: true
  }
});

const userUpdateTypes = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    first_name: true,
    last_name: true,
    password: true
  }
});

export type userCreatePayloads = Prisma.UserGetPayload<typeof userCreateTypes>;

export type userUpdatePayloads = Prisma.UserGetPayload<typeof userUpdateTypes>;
