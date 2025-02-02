import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export const transactionStatus = ['pending', 'succeeded', 'failed'] as const;

export type TransactionStatus = (typeof transactionStatus)[number];

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Transaction {
  @Prop({
    required: true,
    index: true,
    type: Types.ObjectId,
    ref: 'events',
  })
  event: Types.ObjectId;

  @Prop({
    required: true,
  })
  nTickets: number;

  @Prop({
    required: true,
  })
  customerEmail: string;

  @Prop({
    required: true,
    enum: transactionStatus,
  })
  status: TransactionStatus;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
