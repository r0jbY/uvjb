import { z } from 'zod';

export const manageNetworkSchema = z.object({
  clientId: z.string().uuid(),
  addBuddies: z.array(z.string().uuid()).optional(),
  removeBuddies: z.array(z.string().uuid()).optional(),
  layer: z.number().int().min(1).max(2),
});