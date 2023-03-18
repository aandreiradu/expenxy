import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions';
import bodyParser from 'body-parser';
import checkJWTToken from './middlewares/checkJWTToken';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import accountRoutes from './routes/account';
import testRoutes from './routes/test';
import { Prisma } from '@prisma/client';
import { AuthService } from './services/auth/auth';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

const app = express();

// Cookie parser middleware
app.use(cookieParser());

// app.use(cors<Request>());
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.use(express.json());
app.use(bodyParser.json()); // for json
app.use(bodyParser.urlencoded({ extended: true }));

interface CustomError extends Error {
  status: number;
  data?: string[];
  error?: string[];
}

export interface ResponseAPI {
  message: string;
  data?: string | string[];
  error?: string[];
}

app.use(authRoutes);

// app.get('/me', async (req, res, next) => {
//   const refreshToken = req.cookies['EXPENXY_REFRESH_TOKEN'];

//   try {
//     const user = await AuthService.getUserByRefreshToken(refreshToken);
//     return res.status(200).json(user);
//   } catch (error) {
//     res.status(400).send('blablabla');
//   }
// });

app.post('/test', (req, res, next) => {
  try {
    if (!req.body.refreshToken) {
      console.log('generate token');
      const refreshToken = jwt.sign({ userId: 123 }, process.env.EXPENXY_LOGIN_REFRESH_EXPIRATION_PARAM!, {
        expiresIn: '1s',
      });

      return res.status(200).send(refreshToken);
    } else {
      console.log('verify token');
      const decoded = jwt.verify(req.body.refreshToken, process.env.EXPENXY_LOGIN_REFRESH_EXPIRATION_PARAM!);
      return res.status(200).send(decoded);
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const error = {
        status: 400,
        message: 'Token expired boss',
      };

      return next(error);
    }
  }
});

app.use(checkJWTToken);

app.use(transactionRoutes);

app.use(accountRoutes);

app.use((err: CustomError, req: Request, res: Response<ResponseAPI>, next: NextFunction) => {
  console.log('error middleware', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('error instance of primsa', err);
    return res.status(500).send({
      message: 'Something went wrong. Please try again later',
    });
  }

  const { message, status, data, error } = err;
  const statusCode = status ?? 500;

  console.log('error from Error middleware', err);

  return res.status(statusCode).send({
    message,
    data: data,
    error: error,
  });
});

app.listen(process.env.PORT, () => {
  console.log('server listening on port', process.env.PORT);
});
