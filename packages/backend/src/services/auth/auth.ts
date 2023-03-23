import prisma from '../../utils/prisma';
import bcrypt from 'bcrypt';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { CreateUserArgs, LoginArgs, TGetUserById, CheckTokenArgs, DecodedAuthJWT, TReturnCheckToken } from './types';
import crypto from 'crypto';

interface IAuthService {
  createUser(args: CreateUserArgs): Promise<{ username: string; email: string }>;

  login(args: LoginArgs): Promise<{
    accessToken: string;
    username: string;
    refreshToken: string;
    bankAccountsNo: number;
  }>;

  checkToken(args: CheckTokenArgs): Promise<TReturnCheckToken>;

  // generateRefreshToken(args: GenerateToken): Promise<{ token: string }>;

  generateAccessToken(bankAccountsNo: number, userId: string): string;

  // generateAuthTokens(args: Omit<GenerateToken, 'type'>): Promise<{ accessToken: string; refreshToken: string } | void>;

  getSessionByToken(
    refreshToken: string,
  ): Promise<{ userId: string; bankAccountsNo: number | null; username: string | null; sessionId: string }>;

  // getUserByRefreshToken(refreshToken: string): Promise<{ userId: string; username: string }>;
  getUserByRefreshToken?(refreshToken: string): Promise<{
    username: string;
    id: string;
    _count: {
      Account: number;
    };
  } | null>;

  // deleteSessionByToken(refreshToken : string) : Promise<void>,

  generateTokenResetPw(email: string): Promise<{ resetToken: string; resetTokenExpiration: Date }>;

  checkResetPasswordToken(token: string): Promise<boolean>;

  setNewPassword(password: string, resetToken: string): Promise<boolean>;

  logout(refreshToken: string): Promise<void>;

  getUserById(userId: string, includeColumns: TGetUserById): Promise<any>;
}

export const AuthService: IAuthService = {
  async createUser(params: CreateUserArgs) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: params.email,
          },
          {
            username: params.username,
          },
        ],
      },
    });

    if (existingUser) {
      throw new Error('Email or username already in use');
    }

    const hasedPw = await bcrypt.hash(params.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...params,
        password: hasedPw,
      },
      select: {
        email: true,
        username: true,
      },
    });

    return newUser;
  },

  async login(params: LoginArgs) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: params.usernameOrEmail,
          },
          {
            email: params.usernameOrEmail,
          },
        ],
      },
      select: {
        _count: {
          select: {
            accounts: true,
          },
        },
        id: true,
        password: true,
        username: true,
      },
    });

    if (!user || !user.id) {
      throw new Error('Invalid email or password');
    }

    console.log('user', user);

    const decryptedPw = await bcrypt.compare(params.password, user.password);
    if (!decryptedPw) {
      throw new Error('Invalid email or password');
    }

    /* Generate Refresh Token */
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        bankAccountsNo: user._count.accounts,
      },
      process.env.EXPENXY_LOGIN_REFRESH_SECRET!,
      { expiresIn: '1d' },
    );

    /* Generate Access Token */
    const accessToken = jwt.sign(
      {
        userId: user.id,
        bankAccountsNo: user._count.accounts,
      },
      process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
      { expiresIn: '15m' },
    );

    const dateNow = new Date();
    const expiresAt = new Date(
      dateNow.setSeconds(dateNow.getSeconds() + Number(process.env.EXPENXY_LOGIN_REFRESH_EXPIRATION_PARAM)),
    ).toISOString();

    /* Insert a new record in Sessions. */
    await prisma.session.create({
      data: {
        refreshToken: refreshToken,
        userId: user.id,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt,
      },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: user.username,
      bankAccountsNo: user._count.accounts,
    };
  },

  async getSessionByToken(refreshToken: string) {
    const session = await prisma.session.findFirst({
      where: {
        refreshToken: refreshToken,
        // expiresAt: {
        //   gt: new Date(),
        // },
      },
      select: {
        id: true,
        userId: true,
        User: {
          select: {
            _count: {
              select: {
                accounts: true,
              },
            },
            username: true,
          },
        },
      },
    });

    if (!session || !session.userId) {
      console.log('session not found', session);
      throw new Error('Invalid session');
    }

    return {
      userId: session.userId,
      bankAccountsNo: session.User?._count.accounts || null,
      username: session.User?.username || null,
      sessionId: session.id,
    };
  },

  // async getUserByRefreshToken(refreshToken: string) {

  //   const user = await prisma.user.findFirst({
  //     where: {
  //       refreshToken: refreshToken,
  //     },
  //     select: {
  //       _count: {
  //         select: {
  //           Account: true,
  //         },
  //       },
  //       id: true,
  //       username: true,
  //     },
  //   });

  //   if (!user) {
  //     throw new Error('No user found for provided refresh token');
  //   }

  //   return user;
  // },

  async checkToken(params: CheckTokenArgs) {
    const secret = (
      params.type === 'access' ? process.env.EXPENXY_LOGIN_ACCESS_SECRET : process.env.EXPENXY_LOGIN_REFRESH_SECRET
    )!;

    try {
      const decoded = jwt.verify(params.token, secret) as DecodedAuthJWT;
      console.log('decoded', decoded);
      if (decoded) {
        return {
          isValid: true,
          userId: decoded?.userId,
          refreshToken: params.token,
        };
      }

      return {
        isValid: false,
        refreshToken: null,
        userId: null,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.log('Refresh token expired for userId', params.userId, '...generate a new one!');
        /* Generate new refresh token */
        const refreshToken = jwt.sign(
          {
            userId: params.userId,
            bankAccountsNo: params.bankAccountsNo,
          },
          process.env.EXPENXY_LOGIN_REFRESH_SECRET!,
          { expiresIn: '1d' },
        );

        const dateNow = new Date();
        const expiresAt = new Date(
          dateNow.setSeconds(dateNow.getSeconds() + Number(process.env.EXPENXY_LOGIN_REFRESH_EXPIRATION_PARAM)),
        ).toISOString();

        /* Save new refresh token in the database */
        await prisma.session.update({
          where: {
            id: params.sessionId,
          },
          data: {
            refreshToken: refreshToken,
            expiresAt: expiresAt,
          },
        });

        return {
          isValid: true,
          refreshToken: refreshToken,
          userId: params.userId,
        };
      }

      return {
        isValid: false,
        refreshToken: null,
        userId: null,
      };
    }
  },

  // async generateRefreshToken(params: GenerateToken) {
  //   const type = (
  //     params.type === 'refresh' ? process.env.EXPENXY_LOGIN_REFRESH_SECRET : process.env.EXPENXY_LOGIN_ACCESS_SECRET
  //   )!;

  //   try {
  //     const token = jwt.sign({ userId: params.userId }, type, {
  //       expiresIn: '1d',
  //     });

  //     console.log('new token generated for userId', params.type, params.userId, token);

  //     if (token) {
  //       await prisma.user.update({
  //         where: {
  //           id: params.userId,
  //         },
  //         data: {
  //           refreshToken: token,
  //         },
  //       });
  //     }
  //     return {
  //       token,
  //     };
  //   } catch (error) {
  //     throw new Error(`Error generating refresh token ${error}`);
  //   }
  // },

  // async generateAuthTokens(params: Omit<GenerateToken, 'type'>) {
  //   console.log('params', params);
  //   try {
  //     const accessToken = jwt.sign(
  //       {
  //         userId: params.userId,
  //         bankAccountsNo: params.bankAccountsNo,
  //       },
  //       process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
  //       { expiresIn: '15m' },
  //     );

  //     const refreshToken = jwt.sign(
  //       {
  //         userId: params.userId,
  //         bankAccountsNo: params.bankAccountsNo,
  //       },
  //       process.env.EXPENXY_LOGIN_REFRESH_SECRET!,
  //       { expiresIn: '1h' },
  //     );

  //     console.log('generated this tokens', { accessToken, refreshToken });

  //     await prisma.user.update({
  //       where: {
  //         id: params.userId,
  //       },
  //       data: {
  //         accessToken: accessToken,
  //         // refreshToken: refreshToken,
  //       },
  //     });

  //     return {
  //       accessToken,
  //       refreshToken,
  //     };
  //   } catch (error) {
  //     console.log('ERROR GENERATING AUTH TOKENS FOR userId', params.userId, error);
  //     throw new Error('Unexpected error occured');
  //   }
  // },

  async generateTokenResetPw(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('No user found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    console.log('token generated', token);
    const resetTokenExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes
    console.log(resetTokenExpiration);

    await prisma.user.update({
      where: {
        //email: email, /* TO DO PK */
      },
      data: {
        resetPasswordToken: token,
        resetTokenExpiration: new Date(resetTokenExpiration),
      },
    });

    return {
      resetToken: token,
      resetTokenExpiration: new Date(resetTokenExpiration),
    };
  },

  async checkResetPasswordToken(token: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        AND: {
          resetTokenExpiration: {
            gt: new Date(Date.now()),
          },
        },
      },
    });

    if (!user) {
      console.log('no user found or token expired');
      throw new Error('No account found based on generated token or token is expired');
    }

    return true;
  },

  async setNewPassword(password: string, resetToken: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetToken,
        AND: {
          resetTokenExpiration: {
            gt: new Date(Date.now()),
          },
        },
      },
      select: {
        password: true,
        id: true,
      },
    });

    if (!user) {
      console.log('no user found');
      throw new Error('No account found based on generated token or token is expired');
    }

    const { password: userPassword, id } = user;
    const decriptedPassword = await bcrypt.compare(password, userPassword);
    console.log('decriptedPassword', decriptedPassword);
    if (decriptedPassword) {
      console.log('same password');
      throw new Error('Old password and new password cannot be the same');
    }

    const newHasedPassword = await bcrypt.hash(password, 10);
    console.log('newHasedPassword', newHasedPassword);

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newHasedPassword,
        resetPasswordToken: '',
        resetTokenExpiration: new Date('2000-01-01'),
      },
    });

    return true;
  },

  async logout(refreshToken: string) {
    const { sessionId } = await this.getSessionByToken(refreshToken);

    console.log('sessionId from logout', sessionId);

    if (sessionId) {
      console.log('deleting session with id', sessionId);
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
    }
  },

  generateAccessToken(bankAccountsNo: number, userId: string) {
    const accessToken = jwt.sign(
      {
        userId: userId,
        bankAccountsNo: bankAccountsNo,
      },
      process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
      { expiresIn: '15m' },
    );

    return accessToken;
  },

  // async deleteSessionByToken(refreshToken : string) {
  //     await prisma.session.update({
  //       where : {
  //         id :
  //       }
  //     })
  // },

  async getUserById(userId: string, includeColumns: TGetUserById) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        ...includeColumns,
      },
    });

    return user;
  },
};
