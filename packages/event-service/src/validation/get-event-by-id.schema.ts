import { Types } from 'mongoose';
import { z } from 'zod';

export const GetEventByIdSchema = z
  .string()
  .refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid ObjectId',
  });

export type GetEventByIdDto = z.infer<typeof GetEventByIdSchema>;
