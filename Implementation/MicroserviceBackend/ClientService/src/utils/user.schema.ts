import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().regex(/^\+?\d{7,15}$/, 'Invalid phone number'),
  address: z.string().min(1),
});
