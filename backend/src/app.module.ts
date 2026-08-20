import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { BalancesModule } from './balances/balances.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker'),
    AuthModule,
    UsersModule,
    CategoriesModule,
    BalancesModule,
    TransactionsModule,
    ReportsModule,
    AiModule,
    BudgetsModule,
  ],
})
export class AppModule {}
