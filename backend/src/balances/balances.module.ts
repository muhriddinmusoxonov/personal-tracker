import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Balance, BalanceSchema } from './schemas/balance.schema';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Balance.name, schema: BalanceSchema }])],
  providers: [BalancesService],
  controllers: [BalancesController],
  exports: [BalancesService],
})
export class BalancesModule {}
