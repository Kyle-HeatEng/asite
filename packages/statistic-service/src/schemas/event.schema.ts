import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
import { Transaction } from './transaction.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Event {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    index: true,
    type: Date,
    unique: true,
  })
  date: Date;

  @Prop({
    required: true,
  })
  capacity: number;

  @Prop({
    required: true,
  })
  costPerTicket: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export type EventWithTransactions = Event & { transactions: Transaction[] ; month: number; year: number; };
