import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class ProfilePasswordDto {
  @IsString()
  @MinLength(1)
  password: string;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('reset-data')
  resetData(@CurrentUser() user, @Body() dto: ProfilePasswordDto) {
    return this.usersService.resetData(user.userId, dto.password);
  }

  @Post('delete-account')
  deleteAccount(@CurrentUser() user, @Body() dto: ProfilePasswordDto) {
    return this.usersService.deleteAccount(user.userId, dto.password);
  }
}
