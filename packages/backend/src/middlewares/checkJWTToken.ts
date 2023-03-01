import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseAPI } from '../index';

export interface ICustomRequest extends Request {
  metadata: {
    [key: string]: string | string[];
  };
}

type TDecodedUser = {
  userId: string;
};

const checkJWTToken = (
  req: ICustomRequest,
  res: Response<ResponseAPI>,
  next: NextFunction,
) => {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];

  console.log('authHeader', authHeader);

  if (!authHeader) {
    console.log('n-am gasit auth token');
    return res.status(401).send({
      message: 'Unauthorized',
    });
  }

  const accessToken = (authHeader as string).split(' ')[1];
  console.log('accessToken', accessToken);

  jwt.verify(
    accessToken,
    process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
    (err, decode) => {
      if (err) {
        console.log('Forbidden');
        return res.status(403).send({
          message: 'Forbidden',
        });
      }

      console.log('decoded', decode);
      req.metadata.userId = (decode as TDecodedUser).userId;

      console.log('new request is', req);
      next();
    },
  );
};

export default checkJWTToken;
