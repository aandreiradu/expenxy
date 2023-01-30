import { z } from 'zod';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  email: z.string().min(1).email(),
});

export const loginSchema = z.object({
  password: z.string().min(6),
  usernameOrEmail: z.union([z.string().min(1), z.string().min(1).email()]),
});

export type CreateUserArgs = z.infer<typeof createUserSchema>;
export type LoginArgs = z.infer<typeof loginSchema>;

interface IAuthService {
  createUser(
    args: CreateUserArgs,
  ): Promise<{ username: string; email: string }>;

  login(args: LoginArgs): Promise<{ accessToken: string; username: string }>;
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
      throw new Error('Username or email already in use');
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
        ],
      },
    });

    if (!user) {
      throw new Error('Username or password is not valid');
    }

    const decryptedPw = await bcrypt.compare(params.password, user.password);
    if (!decryptedPw) {
      throw new Error('Username or password is not valid');
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
      username: user.username,
    };
  },
};
