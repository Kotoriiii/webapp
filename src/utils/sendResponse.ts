import { Response } from 'express';

export const sendResponse = (res: Response, data: any, msg?: string) => {
  if (res.statusCode >= 400 && res.statusCode < 600) {
    if (msg) {
      res.json({ code: -1, data, msg });
    } else {
      res.json({ code: -1, data });
    }
  } else {
    res.json({ code: 1, msg, data });
  }
};
