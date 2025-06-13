import { z } from 'zod';

export const acceptSchema = z.object({
  buddyId: z.string()
});

export const finishSchema = z.object({
  buddyId: z.string(),
  description: z.string()
});

