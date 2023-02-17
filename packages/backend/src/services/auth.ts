import { custom, z } from 'zod';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 2 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().min(1).email({ message: 'Invalid email format' }),
});

export const loginSchema = z.object({
  password: z.string().min(6),
  usernameOrEmail: z.union([z.string().min(1), z.string().min(1).email()]),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email' }),
});

export const setNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password should contain at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password should contain at least 6 characters' }),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type CreateUserArgs = z.infer<typeof createUserSchema>;
export type LoginArgs = z.infer<typeof loginSchema>;
export type GetUserByRTArgs = {
  refreshToken: string;
};
export type CheckTokenArgs = {
  type: 'refresh' | 'access';
  token: string;
};
export type GenerateToken = {
  type: 'refresh' | 'access';
  userId: string;
  username: string;
};
export type TGenerateTokenResetPw = {
  email: string;
};
export type SetNewPasswordArgs = z.infer<typeof setNewPasswordSchema>;

interface IAuthService {
  createUser(
    args: CreateUserArgs,
  ): Promise<{ username: string; email: string }>;

  login(
    args: LoginArgs,
  ): Promise<{ accessToken: string; username: string; refreshToken: string }>;

  checkToken(args: CheckTokenArgs): boolean;

  generateRefreshToken(args: GenerateToken): Promise<{ token: string }>;

  generateAuthTokens(
    args: Omit<GenerateToken, 'type'>,
  ): Promise<{ accessToken: string; refreshToken: string } | void>;

  getUserByRefreshToken(
    args: GetUserByRTArgs,
  ): Promise<{ userId: string; username: string }>;

  generateTokenResetPw(
    email: string,
  ): Promise<{ resetToken: string; resetTokenExpiration: Date }>;

  checkResetPasswordToken(token: string): Promise<boolean>;

  setNewPassword(password: string, resetToken: string): Promise<boolean>;
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
    console.log('searching user in db for', params);
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
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const decryptedPw = await bcrypt.compare(params.password, user.password);
    if (!decryptedPw) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign(
      {
        username: params.usernameOrEmail,
      },
      process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
    );
    const refreshToken = jwt.sign(
      {
        username: params.usernameOrEmail,
      },
      process.env.EXPENXY_LOGIN_REFRESH_SECRET!,
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: user.username,
    };
  },
  async getUserByRefreshToken(params: GetUserByRTArgs) {
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: params.refreshToken,
      },
    });

    console.log('getUserByRefreshToken user', user);

    if (!user) {
      throw new Error('No user found for provided refresh token!');
    }

    return {
      userId: user.id,
      username: user.username,
    };
  },

  checkToken(params: CheckTokenArgs) {
    const secret = (
      params.type === 'access'
        ? process.env.EXPENXY_LOGIN_ACCESS_SECRET
        : process.env.EXPENXY_LOGIN_REFRESH_SECRET
    )!;

    try {
      const decoded = jwt.verify(params.token, secret);
      console.log('decoded', decoded);
      if (decoded) {
        return true;
      }

      return false;
    } catch (error) {
      console.log('error checkToken', error);
      return false;
    }
  },

  async generateRefreshToken(params: GenerateToken) {
    const type = (
      params.type === 'refresh'
        ? process.env.EXPENXY_LOGIN_REFRESH_SECRET
        : process.env.EXPENXY_LOGIN_ACCESS_SECRET
    )!;

    try {
      const token = jwt.sign({ username: params.username }, type, {
        expiresIn: '1d',
      });

      console.log(
        'new token generated for userId',
        params.type,
        params.userId,
        token,
      );

      if (token) {
        await prisma.user.update({
          where: {
            id: params.userId,
          },
          data: {
            refreshToken: token,
          },
        });
      }
      return {
        token,
      };
    } catch (error) {
      throw new Error(`Error generating refresh token ${error}`);
    }
  },

  async generateAuthTokens(params: Omit<GenerateToken, 'type'>) {
    try {
      const accessToken = jwt.sign(
        {
          username: params.username,
        },
        process.env.EXPENXY_LOGIN_ACCESS_SECRET!,
      );

      const refreshToken = jwt.sign(
        {
          username: params.username,
        },
        process.env.EXPENXY_LOGIN_REFRESH_SECRET!,
      );

      console.log('generated this token', { accessToken, refreshToken });

      await prisma.user.update({
        where: {
          id: params.userId,
        },
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(
        'ERROR GENERATING AUTH TOKENS FOR userId',
        params.userId,
        error,
      );
      throw new Error('Unexpected error occured');
    }
  },

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
        email: email,
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
      throw new Error(
        'No account found based on generated token or token is expired',
      );
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
      throw new Error(
        'No account found based on generated token or token is expired',
      );
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
};

/*
{
  "error": {
    "message": "Error validation",
    "fieldErrors": {
      "password": [
        "Password should contain at least 6 characters"
      ],
      "confirmPassword": [
        "Password should contain at least 6 characters",
        "Passwords don't match"
      ]
    }
  }


{
  "error": {
    "message": "Error validation",
    "fieldErrors": {
      "confirmPassword": [
        "Passwords don't match"
      ]
    }
  }
}

}


{
  "error": {
    "message": "Error validation",
    "fieldErrors": {
      "token": [
        "Required"
      ]
    }
  }
}

*/
