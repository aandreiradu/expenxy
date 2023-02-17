import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password should contain at least 6 characters' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
