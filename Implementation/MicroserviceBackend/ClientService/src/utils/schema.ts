import { z } from "zod";

export const clientSchema = z.object({
  deviceCode: z.string().uuid(),
  superbuddyId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phoneNumber: z.string().regex(/^\+?\d{7,15}$/, "Invalid phone number"),
  address: z.string().min(1),
  active: z.boolean().optional(), 
});