import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './service/email.service';
import { PaymentService } from './service/payment.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI), 
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, EmailService, PaymentService],
})
export class AppModule {}
