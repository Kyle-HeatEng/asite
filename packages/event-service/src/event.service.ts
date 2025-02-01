import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './event.schema';
import { CreateEventDto } from './validation/create-event.schema';
import { GetEventsQueryDto } from './validation/get-events.schema';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async get({
    page = 1,
    limit = 10,
    search = '',
    sort = 'date',
    direction = 1,
  }: GetEventsQueryDto): Promise<{ events: Event[]; hasNext: boolean }> {
    const session = await this.eventModel.db.startSession();

    try {
      let result: { events: Event[]; hasNext: boolean };

      await session.withTransaction(async (session) => {
        const filter = { name: { $regex: search, $options: 'i' } };

        const [totalEvents, events] = await Promise.all([
          this.eventModel.countDocuments(filter).session(session),
          this.eventModel
            .find(filter)
            .sort({ [sort]: direction })
            .skip((page - 1) * limit)
            .limit(limit)
            .session(session),
        ]);

        result = {
          events,
          hasNext: totalEvents > page * limit,
        };
      });

      this.logger.log(`[GET] Retrieved ${result.events.length} events`);
      return result!;
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve events',
        error: error.message || 'Internal Server Error',
      });
    } finally {
      session.endSession();
    }
  }
  
  async getById(
    id: string,
    projection?: Record<keyof Event, number>,
  ): Promise<Event> {
    const event = await this.eventModel.findById(id, projection);

    if (!event) {
      this.logger.log(`[GETBYID] Event with id: ${id} not found`);
      throw new NotFoundException({
        statusCode: 404,
        message: 'Event not found',
        error: 'Not Found',
      });
    }

    this.logger.log(`[GETBYID] Retrieved event with id: ${id}`);
    return event;
  }

  async create(eventData: CreateEventDto): Promise<Event> {
    // Requirement only one event can be created per day
    const existingEvent = await this.eventModel.findOne(
      {
        date: eventData.date,
      },
      {
        _id: 1,
      },
    );

    if (existingEvent) {
      throw new ConflictException({
        statusCode: 409,
        message: 'An event already exists for this date',
        error: 'Conflict',
      });
    }

    this.logger.log(`[CREATE] Creating event with name: ${eventData.name}`);
    return await new this.eventModel(eventData).save();
  }
}
