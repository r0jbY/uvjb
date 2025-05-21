import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "buddy", "superbuddy"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(8),
  address: z.string().min(5),
  active: z.boolean()
});

export const updateSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "buddy", "superbuddy"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(8),
  address: z.string().min(5),
  active: z.boolean()
});