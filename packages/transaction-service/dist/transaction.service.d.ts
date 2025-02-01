import { Model, Types } from 'mongoose';
import { Transaction } from './transaction.schema';
import { GetTransactionsQueryDto } from './validation/get-transactions.schema';
import { OrderDto } from './validation/order.schema';
export declare class TransactionService {
    private readonly transactionModel;
    private readonly logger;
    constructor(transactionModel: Model<Transaction>);
    create(order: OrderDto): Promise<import("mongoose").Document<unknown, {}, Transaction> & Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string | Types.ObjectId, status: string): Promise<import("mongoose").Document<unknown, {}, Transaction> & Transaction & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getTransactions({ eventId, status, page, limit, search, sort, direction, }: GetTransactionsQueryDto): Promise<{
        transactions: Transaction[];
        hasNext: boolean;
    }>;
    getHasCapacity(eventId: string, orderTotalTickets: number, capacity: number): Promise<boolean>;
    getEventById(id: string): Promise<any>;
}
