import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ZodValidationPipe } from './order.pipe';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderSchema } from './validation/create-order.schema';

@Controller('/api/orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        event: { type: 'string', example: new Types.ObjectId().toHexString() },
        nTickets: { type: 'number', example: 2 },
        customerEmail: { type: 'string', example: 'test@gmail.com' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 409, description: 'Event is full' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({
    status: 502,
    description: 'Failed to retrieve transactions from external service',
  })
  @UsePipes(new ZodValidationPipe(CreateOrderSchema))
  async createOrder(@Body() body: CreateOrderDto) {
    return await this.service.create(body);
  }
}
