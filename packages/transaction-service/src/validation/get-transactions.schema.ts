import { Types } from 'mongoose';
import { z } from 'zod';

export const GetTransactionsQuerySchema = z.object({
  eventId: z.string().refine((id) => Types.ObjectId.isValid(id), {
    message: 'Invalid ObjectId',
  }),
  status: z.string().optional().default(''),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional().default(''),
  sort: z.string().optional().default('date'),
  direction: z
    .string()
    .optional()
    .transform((val) => (val === '-1' ? -1 : 1)) // Default to 1 if not provided
    .refine((val) => val === 1 || val === -1, {
      message: 'Direction must be 1 or -1',
    }),
});

export type GetTransactionsQueryDto = z.infer<
  typeof GetTransactionsQuerySchema
>;
