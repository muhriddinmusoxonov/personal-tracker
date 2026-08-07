import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { BalancesModule } from '../balances/balances.module';
import { CategoriesModule } from '../categories/categories.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || './uploads',
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
    BalancesModule,
    CategoriesModule,
    AiModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
