import { Prisma } from '@prisma/client';

const userCreateTypes = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    first_name: true,
    last_name: true,
    password: true,
    username: true,
    verifyCode: true,
    isSend: true,
    isVerify: true
  }
});

const userUpdateTypes = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    first_name: true,
    last_name: true,
    password: true,
    account_updated: true
  }
});

const userVerifyTypes = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    isVerify: true,
    account_updated: true
  }
});

export type userCreatePayloads = Prisma.UserGetPayload<typeof userCreateTypes>;

export type userUpdatePayloads = Prisma.UserGetPayload<typeof userUpdateTypes>;

export type userVerifyPayloads = Prisma.UserGetPayload<typeof userVerifyTypes>;
