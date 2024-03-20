import createError from 'http-errors';
import express, { ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger, { FormatFn } from 'morgan';
import fs from 'fs';

import headlthzRouter from './routes/healthzRouter';
import usersRouter from './routes/userRouter';

const app = express();

function formatUTCWithMs(date: Date) {
  function parse(number: number) {
      if (number < 10) {
          return '0' + number;
      }
      return number;
  }

  function parseMs(number: number) {
      if (number < 10) {
          return '00' + number;
      } else if (number < 100) {
          return '0' + number;
      }
      return number;
  }

  return date.getUTCFullYear() +
      '-' + parse(date.getUTCMonth() + 1) +
      '-' + parse(date.getUTCDate()) +
      'T' + parse(date.getUTCHours()) +
      ':' + parse(date.getUTCMinutes()) +
      ':' + parse(date.getUTCSeconds()) +
      '.' + parseMs(date.getUTCMilliseconds()) +
      'Z';
}

const jsonFormat: FormatFn = (tokens, req, res) => {
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    date: formatUTCWithMs(new Date()),
    method: tokens['method'](req, res),
    url: tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    referrer: tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'response-time': `${tokens['response-time'](req, res)} ms`,
    'severity': Number(tokens['status'](req, res)) >= 400 ? 'ERROR': 'INFO'
  });
};

const logStream = fs.createWriteStream(path.resolve(__dirname, '../logs/access.log'), {
  flags: 'a'
});

app.use(logger(jsonFormat, { stream: logStream }));
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
