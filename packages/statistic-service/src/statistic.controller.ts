import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { sub } from 'date-fns';
import { ZodValidationPipe } from './statistic.pipe';
import { StatisticService } from './statistic.service';
import {
  GetStatisticDto,
  GetStatisticSchema,
} from './validation/get-statistic';

@Controller('/api/statistic')
export class StatisticController {
  constructor(private service: StatisticService) {}
  @Get('')
  @ApiOperation({ summary: 'Get Statistics' })
  @ApiResponse({ status: 200, description: 'Statistics successfully fetched' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({
    name: 'from',
    required: false,
    type: Number,
    example: sub(Date.now(), { months: 12 }).getTime(),
    description: 'Start date as a timestamp',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: Number,
    example: Date.now(),
    description: 'End date as a timestamp',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Limit the number of results',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Regex search of name in events',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: 'date',
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'direction',
    required: false,
    type: Number,
    example: -1,
    description: 'Sort direction: 1 for ascending, -1 for descending',
  })
  @UsePipes(new ZodValidationPipe(GetStatisticSchema))
  async getStatistic(@Query() query: GetStatisticDto) {
    return await this.service.getStatistic(query);
  }
}
