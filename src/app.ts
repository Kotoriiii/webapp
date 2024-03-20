import createError from 'http-errors';
import express, { ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';

import headlthzRouter from './routes/healthzRouter';
import usersRouter from './routes/userRouter';
import { IncomingMessage } from 'http';

const app = express();

interface IReq extends IncomingMessage {
  originalUrl: string;
}

logger.token('json', (req: IReq, res) =>
  JSON.stringify({
    remoteAddr: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    date: new Date().getTime(),
    method: req.method,
    url: req.originalUrl,
    httpVersion: `HTTP/${req.httpVersion}`,
    status: res.statusCode,
    contentLength: res.getHeader('content-length') || '0',
    referrer: req.headers['referrer'] || '',
    userAgent: req.headers['user-agent'] || ''
  })
);

const logStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), { flags: 'a' });

app.use(logger(':json', { stream: logStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

app.use('/api/v1/healthz', headlthzRouter);
app.use('/api/v1/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).send();
} as ErrorRequestHandler);

export default app;
