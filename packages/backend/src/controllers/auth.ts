import { NextFunction, Request, Response } from 'express';
import {
  createUserSchema,
  loginSchema,
  CreateUserArgs,
  AuthService,
  LoginArgs,
} from '../services/auth';

interface IResponse<T = any> {
  message?: string;
  data?: T;
  error?: {
    message?: string;
    fieldErrors?: {
      [key: string]: string[];
    };
  };
}

export const registerController = async (
  req: Request<{}, {}, CreateUserArgs>,
  res: Response<IResponse>,
  next: NextFunction,
) => {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    const formatted = result.error.flatten();

    res.status(400).send({
      error: {
        message: 'Error validation',
        fieldErrors: formatted.fieldErrors,
      },
    });
  }

  try {
    await AuthService.createUser(req.body);
    res.status(200).send({
      message: 'Account created',
    });
  } catch (error) {
    return next(error);
  }
};

export const authController = async (
  req: Request<{}, {}, LoginArgs>,
  res: Response<IResponse<{ username: string; accessToken: string }>>,
  next: NextFunction,
) => {
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    const flatten = validationResult.error.flatten();

    return res.status(400).send({
      error: {
        message: 'Error validation',
        fieldErrors: flatten.fieldErrors,
      },
    });
  }

  try {
    const { accessToken, username } = await AuthService.login(req.body);

    res.cookie('EXPENXY_ACCESS_TOKEN', accessToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      data: {
        accessToken,
        username,
      },
    });
  } catch (error) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return next(error);
  }
};

export default registerController;
