import { EmailService } from './service/email.service';
import { PaymentService } from './service/payment.service';
import { TransactionService } from './transaction.service';
import { GetTransactionsQueryDto } from './validation/get-transactions.schema';
import { OrderDto } from './validation/order.schema';
export declare class TransactionController {
    private readonly service;
    private readonly emailService;
    private readonly paymentService;
    private readonly logger;
    constructor(service: TransactionService, emailService: EmailService, paymentService: PaymentService);
    getTransactions(eventId: string, query: GetTransactionsQueryDto): Promise<{
        transactions: import("./transaction.schema").Transaction[];
        hasNext: boolean;
    }>;
    processOrder(order: OrderDto): Promise<void>;
}
