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
var TransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("./transaction.schema");
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
        this.logger = new common_1.Logger(TransactionService_1.name);
    }
    async create(order) {
        const transaction = new this.transactionModel({
            ...order,
            status: 'pending',
        });
        try {
            await transaction.save();
            this.logger.log(`[CREATE] Transaction ${transaction._id} created`);
            return transaction;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                statusCode: 500,
                message: 'Failed to create transaction',
                error: error.message || 'Internal Server Error',
            });
        }
    }
    async update(id, status) {
        try {
            const transaction = await this.transactionModel.findByIdAndUpdate(id, { status }, { new: true });
            return transaction;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                statusCode: 500,
                message: 'Failed to update transaction',
                error: error.message || 'Internal Server Error',
            });
        }
    }
    async getTransactions({ eventId, status = 'success', page = 1, limit = 10, search = '', sort = 'createdAt', direction = 1, }) {
        const session = await this.transactionModel.db.startSession();
        try {
            let result;
            await session.withTransaction(async (session) => {
                const filter = {
                    event: eventId,
                    status,
                    customerEmail: { $regex: search, $options: 'i' },
                };
                const [totalTransactions, transactions] = await Promise.all([
                    this.transactionModel.countDocuments(filter).session(session),
                    this.transactionModel
                        .find(filter)
                        .sort({ [sort]: direction })
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .session(session),
                ]);
                result = {
                    transactions,
                    hasNext: totalTransactions > page * limit,
                };
            });
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({
                statusCode: 500,
                message: 'Failed to retrieve transactions',
                error: error.message || 'Internal Server Error',
            });
        }
        finally {
            session.endSession();
        }
    }
    async getHasCapacity(eventId, orderTotalTickets, capacity) {
        const { totalSoldTickets } = (await this.transactionModel.aggregate([
            {
                $match: {
                    event: eventId,
                    status: 'success',
                },
            },
            {
                $group: {
                    _id: '$event',
                    totalSoldTickets: { $sum: '$nTickets' },
                },
            },
        ])).at(0) || { totalSoldTickets: 0 };
        return totalSoldTickets + orderTotalTickets <= capacity;
    }
    async getEventById(id) {
        try {
            const response = await fetch(`${process.env.EVENT_SERVICE_API}/${id}`);
            if (!response.ok) {
                return null;
            }
            const event = await response.json();
            return event;
        }
        catch (error) {
            return null;
        }
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = TransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map