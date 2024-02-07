import createError from 'http-errors';
import express, { ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import headlthzRouter from './routes/healthzRouter';
import usersRouter from './routes/userRouter';

const app = express();

app.use(logger('dev'));
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
