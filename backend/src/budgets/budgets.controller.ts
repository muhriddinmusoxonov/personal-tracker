import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BudgetsService, BudgetInput } from './budgets.service';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  // month = "YYYY-MM", berilmasa joriy oy olinadi
  @Get()
  findAll(@CurrentUser() user, @Query('month') month?: string) {
    const target = month || new Date().toISOString().slice(0, 7);
    return this.budgetsService.findAllWithProgress(user.userId, target);
  }

  @Post()
  create(@CurrentUser() user, @Body() body: BudgetInput) {
    return this.budgetsService.create(user.userId, body);
  }

  @Patch(':id')
  update(@CurrentUser() user, @Param('id') id: string, @Body() body: Partial<BudgetInput>) {
    return this.budgetsService.update(user.userId, id, body);
  }

  @Delete(':id')
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.budgetsService.remove(user.userId, id);
  }
}
