import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseAPI } from '../index';

declare global {
  namespace Express {
    interface Request {
      metadata: {
        [key: string]: string | string[];
      };
    }
  }
}

interface TDecodedUser {
  userId: string;
}

<<<<<<< HEAD
const checkJWTToken = (
  req: Request,
  res: Response<ResponseAPI>,
  next: NextFunction,
) => {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];

  console.log('authHeader', authHeader);

  if (!authHeader) {
    return res.status(401).send({
      message: 'Unauthorized',
    });
=======
const checkJWTToken = (req: Request, res: Response<ResponseAPI>, next: NextFunction) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  console.log('CHECKJWT__ authHeader', authHeader);

  if (!authHeader) {
    console.log('CHECKJWT__ return 401 Unauthorized');
    return res.status(401).send({
      message: 'Unauthorized',
    });
  } else {
    console.log('am auth header', authHeader);
>>>>>>> main
  }
  const accessToken = (authHeader as string).split(' ')[1];

  try {
<<<<<<< HEAD
    jwt.verify(
      accessToken,
      process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
      (err, decode) => {
        if (err) {
          return res.status(403).send({
            message: 'Forbidden',
          });
        }

        Object.assign(req, {
          metadata: {
            userId: (decode as TDecodedUser).userId,
          },
        });
        return next();
      },
    );
=======
    jwt.verify(accessToken, process.env.EXPENXY_LOGIN_ACCESS_SECRET!, (err, decode) => {
      if (err) {
        console.log('CHECKJWT__ return 403 Forbidden');
        return res.status(403).send({
          message: 'Forbidden',
        });
      }

      Object.assign(req, {
        metadata: {
          userId: (decode as TDecodedUser).userId,
        },
      });
      return next();
    });
>>>>>>> main
  } catch (error) {
    console.log('error checkJWTTOKen', error);
    return next('Someting went wrong, try again later!');
  }
};

export default checkJWTToken;
