import { HydratedDocument, Types } from 'mongoose';
export type TransactionDocument = HydratedDocument<Transaction>;
export declare const transactionStatus: readonly ["pending", "completed", "failed"];
export type TransactionStatus = (typeof transactionStatus)[number];
export declare class Transaction {
    event: Types.ObjectId;
    nTickets: number;
    customerEmail: string;
    status: TransactionStatus;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, import("mongoose").Document<unknown, any, Transaction> & Transaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Transaction>> & import("mongoose").FlatRecord<Transaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
