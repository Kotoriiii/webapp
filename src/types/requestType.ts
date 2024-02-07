import { Request } from 'express';

export interface IRequest extends Request {
  userInfo: {
    id: string;
  };
}