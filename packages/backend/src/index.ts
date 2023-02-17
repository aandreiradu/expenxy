import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions';
import bodyParser from 'body-parser';

const app = express();

// Cookie parser middleware
app.use(cookieParser());

// app.use(cors<Request>());
app.use(cors({ origin: true, optionsSuccessStatus: 200, credentials: true }));

app.use(express.json());
app.use(bodyParser.json()); // for json
app.use(bodyParser.urlencoded({ extended: true }));

interface CustomError extends Error {
  status: number;
  data?: string[];
  error?: string[];
}

interface ResponseAPI {
  message: string;
  data?: string | string[];
  error?: string[];
}

app.use('/', routes);

app.use(
  (
    errorAxios: CustomError,
    req: Request,
    res: Response<ResponseAPI>,
    next: NextFunction,
  ): void => {
    console.log('error middleware', errorAxios);
    const { message, status, data, error } = errorAxios;
    const statusCode = status ?? 400;

    res.status(statusCode).send({
      message,
      data: data,
      error: error,
    });
  },
);

app.listen(process.env.PORT, () => {
  console.log('server listening on port', process.env.PORT);
});