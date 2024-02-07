import { hash, compare } from 'bcryptjs';

const saltRounds = 10;

export const hashedPassword = async (plainPassword: string) => {
  const password = await hash(plainPassword, saltRounds);
  return password;
};

export const isMatch = async (plainPassword: string, hashedPassword: string) => {
  const match = await compare(plainPassword, hashedPassword);
  return match;
};
