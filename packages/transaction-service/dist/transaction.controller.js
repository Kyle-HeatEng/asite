"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const email_service_1 = require("./service/email.service");
const payment_service_1 = require("./service/payment.service");
const transaction_service_1 = require("./transaction.service");
const get_transactions_schema_1 = require("./validation/get-transactions.schema");
const order_schema_1 = require("./validation/order.schema");
let TransactionController = class TransactionController {
    constructor(service, emailService, paymentService) {
        this.service = service;
        this.emailService = emailService;
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(transaction_service_1.TransactionService.name);
    }
    async getTransactions(eventId, query) {
        const payload = get_transactions_schema_1.GetTransactionsQuerySchema.safeParse({
            ...query,
            eventId,
        });
        if (!payload.success) {
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: payload.error.format(),
            });
        }
        return this.service.getTransactions(payload.data);
    }
    async processOrder(order) {
        console.dir(order);
        this.logger.log(`[PROCESS] Processing order ${order.id} for ${order?.event}`);
        const payload = order_schema_1.OrderSchema.safeParse(order);
        if (!payload.success) {
            this.logger.error(`[PROCESS] Validation failed for order ${order.id}`, payload.error);
        }
        try {
            const transaction = await this.service.create(payload.data);
            const event = await this.service.getEventById(payload.data.event);
            if (!event) {
                this.logger.error(`[PROCESS] Event ${payload.data.event} not found`);
                await this.emailService.sendEmail(payload.data.customerEmail, 'failed');
                return;
            }
            const hasCapacity = await this.service.getHasCapacity(event.id, payload.data.nTickets, event.capacity);
            if (!hasCapacity) {
                this.logger.error(`[PROCESS] Event ${event.id} is full`);
                await this.emailService.sendEmail(payload.data.customerEmail, 'failed');
                return;
            }
            await this.paymentService.createPayment();
            await this.service.update(transaction._id, 'success');
            await this.emailService.sendEmail(payload.data.customerEmail, 'success');
            this.logger.log(`[PROCESS] Order ${order.id} processed successfully`);
        }
        catch (error) {
            this.logger.error(`[PROCESS] Failed to process order ${order.id}`, error.message);
        }
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Get)('/:eventId/transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve transactions for a specific event' }),
    (0, swagger_1.ApiParam)({
        name: 'eventId',
        type: 'string',
        description: 'ID of the event',
        example: '60d21b4667d0d8992e610c85',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: 'string',
        example: 'success',
        description: 'Filter transactions by status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 10,
        description: 'Number of transactions per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: 'string',
        example: 'customer@example.com',
        description: 'Search by customer email',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        type: 'string',
        example: 'createdAt',
        description: 'Sort field',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'direction',
        required: false,
        type: 'number',
        example: 1,
        description: 'Sort direction (1 for ascending, -1 for descending)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transactions retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Event not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactions", null);
__decorate([
    (0, microservices_1.EventPattern)('order.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "processOrder", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.Controller)('/api/transactions'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        email_service_1.EmailService,
        payment_service_1.PaymentService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map