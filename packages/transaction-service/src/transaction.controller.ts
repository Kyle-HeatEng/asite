import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EmailService } from './service/email.service';
import { PaymentService } from './service/payment.service';
import { TransactionService } from './transaction.service';
import {
  GetTransactionsQueryDto,
  GetTransactionsQuerySchema,
} from './validation/get-transactions.schema';
import { OrderDto, OrderSchema } from './validation/order.schema';

@Controller('/api/transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly service: TransactionService,
    private readonly emailService: EmailService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/:eventId/transactions')
  @ApiOperation({ summary: 'Retrieve transactions for a specific event' })
  @ApiParam({
    name: 'eventId',
    type: 'string',
    description: 'ID of the event',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'string',
    example: 'success',
    description: 'Filter transactions by status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 10,
    description: 'Number of transactions per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search by customer email',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: 'string',
    example: 'createdAt',
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'direction',
    required: false,
    type: 'number',
    example: 1,
    description: 'Sort direction (1 for ascending, -1 for descending)',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTransactions(
    @Param('eventId') eventId: string,
    @Query() query: GetTransactionsQueryDto,
  ) {
    const payload = GetTransactionsQuerySchema.safeParse({
      ...query,
      eventId,
    });

    if (!payload.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: payload.error.format(),
      });
    }

    return this.service.getTransactions(payload.data);
  }

  @EventPattern('order.created')
  async processOrder(order: OrderDto) {
    console.dir(order);
    this.logger.log(
      `[PROCESS] Processing order ${order.id} for ${order?.event}`,
    );
    const payload = OrderSchema.safeParse(order);

    if (!payload.success) {
      this.logger.error(
        `[PROCESS] Validation failed for order ${order.id}`,
        payload.error,
      );
    }

    try {
      const transaction = await this.service.create(payload.data);

      const event = await this.service.getEventById(payload.data.event);

      if (!event) {
        this.logger.error(`[PROCESS] Event ${payload.data.event} not found`);
        await this.emailService.sendEmail(payload.data.customerEmail, 'failed');
        return;
      }

      const hasCapacity = await this.service.getHasCapacity(
        event.id,
        payload.data.nTickets,
        event.capacity,
      );

      if (!hasCapacity) {
        this.logger.error(`[PROCESS] Event ${event.id} is full`);
        await this.emailService.sendEmail(payload.data.customerEmail, 'failed');
        return;
      }

      await this.paymentService.createPayment();

      await this.service.update(transaction._id, 'success');

      await this.emailService.sendEmail(payload.data.customerEmail, 'success');
      this.logger.log(`[PROCESS] Order ${order.id} processed successfully`);
    } catch (error) {
      this.logger.error(
        `[PROCESS] Failed to process order ${order.id}`,
        error.message,
      );
    }
  }
}
