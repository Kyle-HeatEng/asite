import { z } from 'zod';
export declare const GetTransactionsQuerySchema: z.ZodObject<{
    eventId: z.ZodEffects<z.ZodString, string, string>;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string>;
    limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string>;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    direction: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, 1 | -1, string>, 1 | -1, string>;
}, "strip", z.ZodTypeAny, {
    status?: string;
    sort?: string;
    search?: string;
    eventId?: string;
    page?: number;
    limit?: number;
    direction?: 1 | -1;
}, {
    status?: string;
    sort?: string;
    search?: string;
    eventId?: string;
    page?: string;
    limit?: string;
    direction?: string;
}>;
export type GetTransactionsQueryDto = z.infer<typeof GetTransactionsQuerySchema>;
