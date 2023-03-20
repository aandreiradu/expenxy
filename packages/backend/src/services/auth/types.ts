import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const createUserSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 2 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().min(1).email({ message: 'Invalid email format' }),
});

export const loginSchema = z.object({
  password: z.string().min(6),
  usernameOrEmail: z.union([z.string().min(1), z.string().min(1).email()]),
});

export const resetPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email' }),
});

export const setNewPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Password should contain at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Password should contain at least 6 characters' }),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type CreateUserArgs = z.infer<typeof createUserSchema>;
export type LoginArgs = z.infer<typeof loginSchema>;
// export type GetUserByRTArgs = {
//   refreshToken: string;
// };
export type CheckTokenArgs = {
  type: 'refresh' | 'access';
  token: string;
  userId: string;
  bankAccountsNo: number;
  sessionId: string;
};
export type GenerateToken = {
  type: 'refresh' | 'access';
  userId: string;
  username: string;
  bankAccountsNo?: number;
};
export type TGenerateTokenResetPw = {
  email: string;
};
export type SetNewPasswordArgs = z.infer<typeof setNewPasswordSchema>;

export type DecodedAuthJWT = {
  userId: string | null;
  isValid: boolean;
};

export type TReturnCheckToken = DecodedAuthJWT & {
  refreshToken: string | null;
};

export type TGetUserById = Partial<Record<keyof Omit<Prisma.UserSelect, 'password'>, boolean>>;
