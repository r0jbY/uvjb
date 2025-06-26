import { z } from 'zod';

export const pushSchema = z.object({
  id: z.string().uuid(),
  token: z
    .string()
});

