import { Types } from 'mongoose';
import { z } from 'zod';

export const CreateOrderSchema = z.object({
  event: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid ObjectId',
  }),
  nTickets: z.number().int().positive(),
  customerEmail: z.string().email(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;