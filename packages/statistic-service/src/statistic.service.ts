import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { getMonth, getYear, sub } from 'date-fns';
import { Model } from 'mongoose';
import { calculations } from './lib/calculations';
import { Event, type EventWithTransactions } from './schemas/event.schema';
import { GetStatisticDto } from './validation/get-statistic';

@Injectable()
export class StatisticService {
  private readonly logger = new Logger(StatisticService.name);

  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  //Choose to not add pagination due to the endpoint not being customer facing
  async getStatistic({
    to = Date.now(),
    from = sub(Date.now(), { months: 12 }).getTime(),
    sort = 'date',
    direction = -1,
    search = '',
  }: GetStatisticDto) {
    const events = await this.aggregateEvents({
      to,
      from,
      sort,
      direction,
      search,
    });

    if (!events) {
      //TODO: better error handling
      throw new Error('Failed to fetch events');
    }

    return calculations(events);
  }

  private async aggregateEvents({
    to = Date.now(),
    from = sub(Date.now(), { months: 12 }).getTime(),
    sort = 'date',
    direction = -1,
    search = '',
  }: GetStatisticDto) {
    try {
      return (
        await this.eventModel.aggregate([
          {
            $match: {
              date: {
                $gte: new Date(from),
                $lte: new Date(to),
              },
              name: {
                $regex: search,
                $options: 'i',
              },
            },
          },
          {
            $lookup: {
              from: 'transactions',
              localField: '_id',
              foreignField: 'event',
              as: 'transactions',
            },
          },
          {
            $sort: {
              [sort]: direction,
            },
          },
        ])
      ).map((event: Event) => ({
        ...event,
        //@ts-ignore
        month: getMonth(new Date(event.date)) + 1,
        //@ts-ignore
        year: getYear(new Date(event.date)),
      })) as EventWithTransactions[];
    } catch (error) {
      this.logger.error(`Failed to aggregate events: ${error.message}`);
      return null;
    }
  }
}
