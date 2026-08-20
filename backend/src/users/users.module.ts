import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Budget, BudgetSchema } from '../budgets/schemas/budget.schema';
import { Balance, BalanceSchema } from '../balances/schemas/balance.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule, MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Transaction.name, schema: TransactionSchema },
    { name: Category.name, schema: CategorySchema },
    { name: Budget.name, schema: BudgetSchema },
    { name: Balance.name, schema: BalanceSchema },
  ])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
