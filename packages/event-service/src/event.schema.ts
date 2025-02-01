
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

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

