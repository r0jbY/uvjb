import { z } from "zod";

export const clientSchema = z.object({
  deviceCode: z.string().uuid(),
  superbuddyId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().min(5),
  address: z.string().min(1),
  active: z.boolean().optional(), 
});