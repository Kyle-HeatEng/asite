"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransactionsQuerySchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.GetTransactionsQuerySchema = zod_1.z.object({
    eventId: zod_1.z.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: 'Invalid ObjectId',
    }),
    status: zod_1.z.string().optional().default(''),
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 10)),
    search: zod_1.z.string().optional().default(''),
    sort: zod_1.z.string().optional().default('date'),
    direction: zod_1.z
        .string()
        .optional()
        .transform((val) => (val === '-1' ? -1 : 1))
        .refine((val) => val === 1 || val === -1, {
        message: 'Direction must be 1 or -1',
    }),
});
//# sourceMappingURL=get-transactions.schema.js.map