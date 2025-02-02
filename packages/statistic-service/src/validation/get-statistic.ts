import { z } from 'zod';

export const GetStatisticSchema = z.object({
  from: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? Number(v) : v))
    .refine((v) => v === undefined || !Number.isNaN(v), {
      message: 'Invalid date format',
    }),
  to: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? Number(v) : v))
    .refine((v) => v === undefined || !Number.isNaN(v), {
      message: 'Invalid date format',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional().default(''),
  sort: z.string().optional().default('date'),
  direction: z
    .string()
    .optional()
    .transform((val) => (val === '-1' ? -1 : 1))
    .refine((val) => val === 1 || val === -1, {
      message: 'Direction must be 1 or -1',
    }),
});

export type GetStatisticDto = z.infer<typeof GetStatisticSchema>;
