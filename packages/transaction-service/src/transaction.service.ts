import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './transaction.schema';
import { GetTransactionsQueryDto } from './validation/get-transactions.schema';
import { OrderDto } from './validation/order.schema';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async create(order: OrderDto) {
    const transaction = new this.transactionModel({
      ...order,
      status: 'pending',
    });

    try {
      await transaction.save();
      this.logger.log(`[CREATE] Transaction ${transaction._id} created`);
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to create transaction',
        error: error.message || 'Internal Server Error',
      });
    }
  }

  async update(id: string | Types.ObjectId, status: string) {
    try {
      const transaction = await this.transactionModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to update transaction',
        error: error.message || 'Internal Server Error',
      });
    }
  }

  async getTransactions({
    eventId,
    status = 'success',
    page = 1,
    limit = 10,
    search = '',
    sort = 'createdAt',
    direction = 1,
  }: GetTransactionsQueryDto): Promise<{
    transactions: Transaction[];
    hasNext: boolean;
  }> {
    const session = await this.transactionModel.db.startSession();

    try {
      let result: { transactions: Transaction[]; hasNext: boolean };

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

      return result!;
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve transactions',
        error: error.message || 'Internal Server Error',
      });
    } finally {
      session.endSession();
    }
  }

  async getHasCapacity(
    eventId: string,
    orderTotalTickets: number,
    capacity: number,
  ) {
    const { totalSoldTickets } = (
      await this.transactionModel.aggregate([
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
      ])
    ).at(0) || { totalSoldTickets: 0 };

    return totalSoldTickets + orderTotalTickets <= capacity;
  }

  async getEventById(id: string) {
    try {
      const response = await fetch(`${process.env.EVENT_SERVICE_API}/${id}`);
      if (!response.ok) {
        return null;
      }
      const event = await response.json();
      return event;
    } catch (error) {
      return null;
    }
  }
}
