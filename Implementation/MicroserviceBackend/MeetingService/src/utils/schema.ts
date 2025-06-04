import { z } from 'zod';

export const acceptSchema = z.object({
  buddyId: z.string()
});

