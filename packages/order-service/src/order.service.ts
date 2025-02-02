import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './validation/create-order.schema';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create({ event: eventId, nTickets, customerEmail }: CreateOrderDto) {
    const event = await this.getEventById(eventId);

    if (!event) {
      this.logger.error(`[CREATE] Event ${eventId} not found`);
      throw new NotFoundException({
        statusCode: 404,
        message: 'Event not found',
        error: 'Not Found',
      });
    }
    const hasCapacity = await this.getHasCapacity(
      event._id,
      event.capacity,
      nTickets,
    );

    if (!hasCapacity) {
      this.logger.error(`[CREATE] Event ${event._id} is full`);
      throw new ConflictException({
        statusCode: 409,
        message: 'Event is full',
        error: 'Conflict',
      });
    }

    const order = {
      id: randomUUID(),
      status: 'placed',
      event: event._id,
      nTickets,
      customerEmail,
    };

    this.logger.log(`[CREATE] Order ${order.id} created for event ${event._id}`);
    this.client.emit('order.created', order)

    return {
      message: 'Order successfully created',
      order,
    };
  }

  private async getEventById(id: string) {
    try {
      const response = await fetch(`${process.env.EVENT_SERVICE_API}/${id}`);
      if (!response.ok) {
        return null;
      }
      const event = await response.json();
      return event as { _id: string; capacity: number } | null;
    } catch (error) {
      this.logger.error(`[GET_BY_ID] Failed to retrieve event ${id}. Service responded with ${error.message}`);
      return null;
    }
  }

  private async getHasCapacity(
    eventId: string,
    eventCapacity: number,
    orderTotalTickets: number,
  ) {
    let currentSoldTickets = 0;
    let page = 1;
    let hasNext = true;

    do {
      const { transactions, hasNext: hNext } = await this.getTransaction({
        eventId,
        status: 'succeeded',
        page,
      });

      currentSoldTickets += transactions.reduce(
        (acc, transaction) => acc + transaction.nTickets,
        0,
      );

      if (currentSoldTickets + orderTotalTickets > eventCapacity) {
        break
      }

      hasNext = hNext
      page++;
    } while (hasNext);

    return currentSoldTickets + orderTotalTickets <= eventCapacity;
  }

  private async getTransaction({
    eventId,
    status,
    page,
  }: {
    eventId: string;
    status: 'succeeded' | 'failed' | 'pending';
    page: number;
  }) {
    try {
      console.log(
        `${process.env.TRANSACTION_SERVICE_API}/${eventId}/transactions?status=${status}&page=${page}`,
      );
      const response = await fetch(
        `${process.env.TRANSACTION_SERVICE_API}/${eventId}/transactions?status=${status}&page=${page}`,
      );
      if (!response.ok) {
        throw new BadGatewayException({
          statusCode: 502,
          message: 'Failed to retrieve transactions from external service',
          error: 'Bad Gateway',
        });
      }

      return (await response.json()) as {
        transactions: any[];
        hasNext: boolean;
      };
    } catch (error) {
      this.logger.error(`[GET_TRANSACTION] Failed to retrieve transactions for event ${eventId}. Service responded with ${error.message}`);
      throw new Error('Failed to retrieve transactions');
    }
  }
}
