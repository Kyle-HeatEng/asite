import { z } from 'zod';
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    event: z.ZodEffects<z.ZodString, string, string>;
    nTickets: z.ZodNumber;
    customerEmail: z.ZodString;
}, "strip", z.ZodTypeAny, {
    event?: string;
    nTickets?: number;
    customerEmail?: string;
    id?: string;
}, {
    event?: string;
    nTickets?: number;
    customerEmail?: string;
    id?: string;
}>;
export type OrderDto = z.infer<typeof OrderSchema>;
