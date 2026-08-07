import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  private parseFilters(query: any) {
    return {
      from: query.from ? new Date(query.from) : new Date(new Date().setHours(0, 0, 0, 0)),
      to: query.to ? new Date(query.to) : new Date(),
      balanceType: query.balanceType,
      direction: query.direction,
      paymentType: query.paymentType,
      categoryIds: query.categories ? query.categories.split(',') : undefined,
    };
  }

  // Dashboard diagrammasi uchun
  @Get('summary')
  summary(@CurrentUser() user, @Query() query: any) {
    return this.reportsService.summary(user.userId, this.parseFilters(query));
  }

  // Excel faylni yuklab olish
  @Get('export')
  async export(@CurrentUser() user, @Query() query: any, @Res() res: Response) {
    const buffer = await this.reportsService.exportExcel(user.userId, user.email, this.parseFilters(query));
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="hisobot-${Date.now()}.xlsx"`,
    });
    res.send(buffer);
  }
}
