import { NextFunction, Request, Response } from 'express';
import {
  createUserSchema,
  loginSchema,
  CreateUserArgs,
  LoginArgs,
  TGenerateTokenResetPw,
  resetPasswordSchema,
  SetNewPasswordArgs,
  setNewPasswordSchema,
} from '../services/auth/types';
import { AuthService } from '../services/auth/auth';
import { sendMail } from '../utils/sendMail';
import { BankAccountService } from '../services/account';

export interface IResponse<T = any> {
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
  console.log('result', result);

  if (!result.success) {
    const formatted = result.error.flatten();

    const error = {
      message: 'Error validation',
      error: {
        fieldErrors: formatted.fieldErrors,
      },
    };
    console.log('error to return', error);
    return next(error);
  }

  try {
    await AuthService.createUser(req.body);
    res.status(200).send({
      data: {
        message: 'Account created',
      },
    });
  } catch (error) {
    console.log('erorare bai', error);
    return next(error);
  }
};

export const authController = async (
  req: Request<{}, {}, LoginArgs>,
  res: Response<
    IResponse<{
      username: string;
      accessToken: string;
<<<<<<< HEAD
      existingBankAccounts: boolean;
=======
      bankAccountsNo: number;
>>>>>>> main
    }>
  >,
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
<<<<<<< HEAD
    const { accessToken, username, refreshToken, userId } = await AuthService.login(req.body);
    const existingBankAccounts = await BankAccountService.needsBankAccount(userId);
    console.log('existingBankAccounts', existingBankAccounts);
=======
    const { accessToken, username, refreshToken, bankAccountsNo } = await AuthService.login(req.body);
    console.log('bankAccountsNo', bankAccountsNo);
>>>>>>> main

    res.cookie('EXPENXY_REFRESH_TOKEN', refreshToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      // maxAge: Number(process.env.EXPENXY_LOGIN_REFRESH_EXPIRATION_PARAM) ?? 24 * 60 * 60 * 1000,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log('return this to frontend', {
      accessToken,
      username,
      bankAccountsNo,
    });

    return res.status(200).send({
      data: {
        accessToken,
        username,
<<<<<<< HEAD
        existingBankAccounts,
=======
        bankAccountsNo,
>>>>>>> main
      },
    });
  } catch (error) {
    console.log('error authController', error);
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    // return next({ message: 'Something went wrong. Please try again later' });
    return next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
<<<<<<< HEAD
  res: Response<IResponse<{ accessToken: string; username: string }>>,
=======
  res: Response<IResponse<{ accessToken: string; username: string; bankAccountsNo: number }>>,
>>>>>>> main
  next: NextFunction,
) => {
  console.log('refreshTokenController requested', req.body, JSON.stringify(req.cookies));
  const jwt: string = req.cookies['EXPENXY_REFRESH_TOKEN'];
<<<<<<< HEAD
  console.log('jwt', jwt);

  if (!jwt) {
    console.log('no jwt provided');
    const error = new Error('Unauthorized');
=======

  if (!jwt) {
    console.log('no jwt provided');
    const error = {
      message: 'Unauthorized',
      status: 401,
    };
>>>>>>> main

    res.clearCookie('EXPENXY_REFRESH_TOKEN', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return next(error);
  }

  // try {
  //   const user = await AuthService.getUserByRefreshToken(jwt);
  //   console.log('user aici', user);
  //   const { isValid, bankAccountsNo, userId } = AuthService.checkToken({
  //     type: 'refresh',
  //     token: jwt,
  //   });

  //   console.log('check token returned', { isValid, bankAccountsNo });

  //   if (!isValid) {
  //     // Return 403 Forbidden - cannot decode refresh token;
  //     console.log('403 Forbidden from refresh controller');
  //     return res
  //       .status(403)
  //       .clearCookie('EXPENXY_REFRESH_TOKEN', {
  //         sameSite: 'none',
  //         httpOnly: true,
  //         secure: true,
  //         maxAge: 24 * 60 * 60 * 1000,
  //       })
  //       .send({ message: 'Forbidden' });
  //   }

  //   const response = await AuthService.generateAuthTokens({
  //     userId: user.id,
  //     username: user.username,
  //     bankAccountsNo: bankAccountsNo,
  //   });

  //   if (response) {
  //     const { accessToken, refreshToken } = response;
  //     console.log('all generated with success, return to frontend', {
  //       accessToken,
  //       refreshToken,
  //       bankAccountsNo,
  //     });

  //     // res.cookie('EXPENXY_REFRESH_TOKEN', refreshToken, {
  //     //   sameSite: 'none',
  //     //   httpOnly: true,
  //     //   secure: true,
  //     //   maxAge: 24 * 60 * 60 * 1000,
  //     // });

  //     return res.status(201).send({
  //       data: {
  //         accessToken,
  //         username: user.username,
  //         bankAccountsNo: bankAccountsNo || 0,
  //       },
  //       message: 'Generated new refresh token successfully',
  //     });
  //   }
  // } catch (error) {
  //   console.log('error refreshTokenController', error);
  //   if (error instanceof Error) {
  //     const { message } = error;

  //     switch (message) {
  //       case 'No user found for provided refresh token': {
  //         const errorReturn = {
  //           message: 'Unauthorized',
  //           status: 401,
  //         };
  //         console.log('No user found for provided refresh token', errorReturn);
  //         return next(errorReturn);
  //       }
  //     }
  //   }
  //   next(error);
  // }

  try {
<<<<<<< HEAD
    const user = await AuthService.getUserByRefreshToken(jwt);
    const isTokenValid = AuthService.checkToken({
      type: 'refresh',
      token: jwt,
    });

    if (!isTokenValid) {
      // Return 403 Forbidden - cannot decode refresh token;
      console.log('403 Forbidden from refresh controller');
      return res
        .status(403)
        .clearCookie('EXPENXY_REFRESH_TOKEN', {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .send({ message: 'Forbidden' });
    }
=======
    const { userId, bankAccountsNo, username, sessionId } = await AuthService.getSessionByToken(jwt);

    if (!userId) {
      console.log('Could not find valid session based on the refresh token!');
>>>>>>> main

      const error = {
        status: 401,
        message: 'Invalid session',
      };

      /* Clear HTTP Only refresh token from cookie  */
      res.clearCookie('EXPENXY_REFRESH_TOKEN', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

<<<<<<< HEAD
      return res.status(201).send({
        data: {
          accessToken,
          username: user.username,
        },
        message: 'Generated new refresh token successfully',
=======
      return next(error);
    }

    const { isValid, refreshToken } = await AuthService.checkToken({
      token: jwt,
      type: 'refresh',
      userId: userId,
      bankAccountsNo: bankAccountsNo || 0,
      sessionId: sessionId,
    });

    if (!isValid /*|| bankAccountsNo === null || bankAccountsNo === undefined*/) {
      console.log('isValid false or bankAccount is null', { isValid, bankAccountsNo, refreshToken });

      // const error = {
      //   status: 401,
      //   message: 'Invalid or expired session',
      // };

      /* Clear HTTP Only refresh token from cookie  */
      res.clearCookie('EXPENXY_REFRESH_TOKEN', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      return res.status(401).send({
        message: 'Unauthorized',
>>>>>>> main
      });
    }

    /* Session is valid here and refresh token didnt expired */

    const accessToken = await AuthService.generateAccessToken(bankAccountsNo || 0, userId);

    /* Clear HTTP Only refresh token from cookie  */
    res.clearCookie('EXPENXY_REFRESH_TOKEN', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    /* Attach new refresh token */
    res.cookie('EXPENXY_REFRESH_TOKEN', refreshToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      // maxAge: Number(process.env.EXPENXY_LOGIN_REFRESH_EXPIRATION_PARAM) ?? 24 * 60 * 60 * 1000,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      data: {
        accessToken: accessToken,
        bankAccountsNo: bankAccountsNo || 0,
        username: username || '',
      },
    });
  } catch (error) {
    console.log('error refreshTokenController', error);
    if (error instanceof Error) {
      const { message } = error;

      switch (message) {
        case 'No user found for provided refresh token': {
          const errorReturn = {
            message: 'Unauthorized',
            status: 401,
          };
          console.log('No user found for provided refresh token', errorReturn);
          return next(errorReturn);
        }

        case 'Invalid session': {
          const errorReturn = {
            message: 'Unauthorized',
            status: 401,
          };
          console.log('CASE : Invalid session', errorReturn);
          return next(errorReturn);
        }
      }
    }
    next(error);
  }
};

export const generateTokenResetPassword = async (
  req: Request<{}, {}, TGenerateTokenResetPw>,
  res: Response<IResponse<{ token: string; tokenExpireDate: Date }>>,
  next: NextFunction,
) => {
  const schemaValidation = resetPasswordSchema.safeParse(req.body);

  if (!schemaValidation.success) {
    const formattedError = schemaValidation.error.flatten();

    const error = {
      message: 'Error validation',
      error: {
        fieldErrors: formattedError.fieldErrors,
      },
    };
    return next(error);
  }

  try {
    const { resetToken, resetTokenExpiration } = await AuthService.generateTokenResetPw(req.body.email);

    if (resetToken && resetTokenExpiration) {
      const mailResponse = await sendMail(
        {
          to: req.body.email,
          type: 'RESET_PASSWORD',
        },
        resetToken,
      );

      return res.status(201).send({
        message: 'Token generated',
        data: {
          token: resetToken,
          tokenExpireDate: resetTokenExpiration,
        },
      });
    }

    const error = new Error('Something went wrong, please try again later');
    return next(error);
  } catch (error) {
    console.log('error generateTokenResetPassword', generateTokenResetPassword);
    return next(error);
  }
};

export const checkResetTokenValidity = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;

  try {
    if (!token) {
      const error = new Error('Invalid request params');
      return next(error);
    }

    const isTokenValid = await AuthService.checkResetPasswordToken(token);

    if (!isTokenValid) {
      const error = new Error('No account found based on generated token or token is expired');
      return next(error);
    }

    return res.status(200).send({
      data: {
        message: 'OK',
      },
    });
  } catch (error) {
    console.log('error checkResetTokenValidity', error);
    return next(error);
  }
};

export const setNewPassword = async (
  req: Request<{}, {}, SetNewPasswordArgs>,
  res: Response<IResponse<{ message: string; error?: string }>>,
  next: NextFunction,
) => {
  const { password, confirmPassword, token } = req.body;

  if (!password || !confirmPassword || !token) {
    const error = new Error('Invalid request params');
    return next(error);
  }

  const validateReqBody = setNewPasswordSchema.safeParse(req.body);

  if (!validateReqBody.success) {
    const flatten = validateReqBody.error.flatten();
    return res.status(400).send({
      error: {
        message: 'Error validation',
        fieldErrors: flatten.fieldErrors,
      },
    });
  }

  try {
    const checkedAndUpdated = await AuthService.setNewPassword(password, token);
    if (!checkedAndUpdated) {
      return res.status(400).send({
        message: 'Something went wrong, please try again later',
      });
    }

    return res.status(200).send({
      data: {
        message: 'Password updated successfully',
      },
    });
  } catch (error) {
    console.log('ERROR setNewPassword', error);
    next(error);
  }
};

export const logOut = async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  console.log('cookies', req.cookies);
  const { EXPENXY_REFRESH_TOKEN } = req.cookies;

  if (!EXPENXY_REFRESH_TOKEN) {
    return res.status(204).send();
  }

  try {
    await AuthService.logout(EXPENXY_REFRESH_TOKEN);

    // clear cookie
    res.clearCookie('EXPENXY_REFRESH_TOKEN', {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    });

    return res.status(200).send({
      data: {
        message: 'Logout completed',
      },
    });
  } catch (error) {
    console.log('error logOut for refreshToken', EXPENXY_REFRESH_TOKEN, error);
    return next(error);
  }
};
