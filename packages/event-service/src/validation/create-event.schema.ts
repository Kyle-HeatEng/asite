import { isValid, parse } from 'date-fns';
import { z } from 'zod';

export const CreateEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  date: z
    .string()
    .transform(parseUKDate)
    .pipe(
      z.date().refine((date) => date > new Date(), {
        message: 'Date must be in the future in the format dd/MM/yyyy and only one event can be created per day',
      }),
    ),
  capacity: z.number().int().positive(),
  costPerTicket: z.number().int().positive(),
});

export type CreateEventDto = z.infer<typeof CreateEventSchema>;

// We make the assumption here that all dates passed to the API will be in the UK formate
function parseUKDate(input: unknown) {
  if (typeof input !== 'string') return input;

  const parsedDate = parse(input, 'dd/MM/yyyy', new Date());
  return isValid(parsedDate) ? parsedDate : null;
}
