import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(@CurrentUser() user, @Query('type') type?: string) {
    await this.categoriesService.ensureDefaultsForUser(user.userId);
    return this.categoriesService.findAllForUser(user.userId, type);
  }

  @Post()
  create(@CurrentUser() user, @Body() body: { name: string; icon: string; type: string }) {
    return this.categoriesService.create(user.userId, body);
  }

  @Patch(':id')
  update(@CurrentUser() user, @Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(user.userId, id, body);
  }

  @Delete(':id')
  remove(@CurrentUser() user, @Param('id') id: string) {
    return this.categoriesService.remove(user.userId, id);
  }
}
