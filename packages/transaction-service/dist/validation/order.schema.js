"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.OrderSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    event: zod_1.z.string().refine((id) => mongoose_1.Types.ObjectId.isValid(id), {
        message: 'Invalid ObjectId',
    }),
    nTickets: zod_1.z.number().int().positive(),
    customerEmail: zod_1.z.string().email(),
});
//# sourceMappingURL=order.schema.js.map