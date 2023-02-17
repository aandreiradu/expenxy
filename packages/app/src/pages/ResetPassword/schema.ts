import { z } from 'zod';

export const setNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password should contain at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password should contain at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export const resetPwSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email' }),
});

export type SetNewPasswordProps = z.infer<typeof setNewPasswordSchema>;
export type ResetPasswordProps = z.infer<typeof resetPwSchema>;
