//Zod schema for endpoint data validation

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(8),
  address: z.string().min(5),
});