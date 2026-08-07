import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BalancesService } from './balances.service';

@UseGuards(JwtAuthGuard)
@Controller('balances')
export class BalancesController {
  constructor(private balancesService: BalancesService) {}

  @Get()
  async get(@CurrentUser() user) {
    const balance = await this.balancesService.getOrCreate(user.userId);
    return this.balancesService.summarize(balance);
  }
}
