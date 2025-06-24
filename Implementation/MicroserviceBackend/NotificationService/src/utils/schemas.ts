import { z } from 'zod';

export const pushSchema = z.object({
  id: z.string().uuid(),
  token: z
    .string()
    .regex(/^ExponentPushToken\[[A-Za-z0-9]{10,}\]$/, {
      message: 'Invalid Expo push token format',
    }),
});

