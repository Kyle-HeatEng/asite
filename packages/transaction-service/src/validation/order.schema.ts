import { Types } from 'mongoose';
import { z } from 'zod';

export const OrderSchema = z.object({
  id: z.string().uuid(),
  event: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid ObjectId',
  }),
  nTickets: z.number().int().positive(),
  customerEmail: z.string().email(),
});

export type OrderDto = z.infer<typeof OrderSchema>;
