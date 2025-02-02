import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from './event.pipe';
import { EventService } from './event.service';
import {
  CreateEventDto,
  CreateEventSchema,
} from './validation/create-event.schema';
import { GetEventByIdSchema } from './validation/get-event-by-id.schema';
import { GetEventsQueryDto, GetEventsQuerySchema } from './validation/get-events.schema';

@Controller('/api/events')
@ApiTags('Events')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Get('')
  @ApiOperation({ summary: 'Get Events' })
  @ApiResponse({ status: 200, description: 'Events successfully fetched' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'date' })
  @ApiQuery({
    name: 'direction',
    required: false,
    type: Number,
    example: 1,
    description: 'Use 1 for ascending and -1 for descending',
  })
  @UsePipes(new ZodValidationPipe(GetEventsQuerySchema))
  async getEvents(@Query() query: GetEventsQueryDto) {
    return await this.service.get(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Event by ID' })
  @ApiResponse({ status: 200, description: 'Event successfully fetched' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ZodValidationPipe(GetEventByIdSchema))
  async getEventById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Post('')
  @ApiOperation({ summary: 'Create an event' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'NestJS Conference' },
        date: { type: 'string', example: '15/06/2025' },
        capacity: { type: 'integer', example: 200 },
        costPerTicket: { type: 'integer', example: 50 },
      },
      required: ['name', 'date', 'capacity', 'costPerTicket'],
    },
  })
  @ApiResponse({ status: 201, description: 'Event successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 409,
    description: 'An event already exists for this date',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UsePipes(new ZodValidationPipe(CreateEventSchema))
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return await this.service.create(createEventDto);
  }
}
