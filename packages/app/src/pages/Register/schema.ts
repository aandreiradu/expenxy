import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: 'Username must be at least 2 charactercters' }),
    email: z.string().min(1, { message: 'Email is required' }).email({
      message: 'Invalid email format',
    }),
    password: z
      .string()
      .min(6, { message: 'Password must be atleast 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type RegisterProps = z.infer<typeof registerSchema>;
