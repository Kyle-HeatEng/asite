import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class AppModule {}
