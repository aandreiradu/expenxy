import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';

const app = express();
app.use(express.json());

interface CustomError extends Error {
  status: number;
  data: string[];
}

interface ResponseAPI {
  message: string;
  data?: string | string[];
}

app.use('/', routes);

app.use(
  (
    error: CustomError,
    req: Request,
    res: Response<ResponseAPI>,
    next: NextFunction,
  ): void => {
    console.log('error middleware', error);
    const { message, status, data } = error;
    const statusCode = status ?? 400;

    res.status(statusCode).send({
      message,
      data: data,
    });
  },
);

app.listen(process.env.PORT, () => {
  console.log('server listening on port', process.env.PORT);
});
