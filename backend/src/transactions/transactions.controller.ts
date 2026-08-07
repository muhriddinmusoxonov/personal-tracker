import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoriesService } from '../categories/categories.service';
import { AiService } from '../ai/ai.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private aiService: AiService,
  ) {}

  // Kirim/chiqim qo'shish. Rasm (chek/skrinshot) bo'lsa 'receipt' fieldi orqali yuboriladi.
  @Post()
  @UseInterceptors(FileInterceptor('receipt'))
  async create(
    @CurrentUser() user,
    @Body() dto: CreateTransactionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let amount: number | undefined;
    let aiAnalysis: Record<string, any> | undefined;
    let categoryId = dto.category;

    // 1) Agar rasm yuklangan va AI so'ralgan bo'lsa - AI orqali summani va category'ni aniqlaymiz
    if (file && dto.useAi === 'true') {
      const categories = await this.categoriesService.findAllForUser(user.userId, dto.direction);
      const analysis = await this.aiService.analyzeReceipt(file.path, file.mimetype, categories.map((c) => c.name));
      aiAnalysis = analysis as any;
      if (analysis.amount) amount = analysis.amount;
      if (!categoryId && analysis.suggestedCategory) {
        const match = categories.find((c) => c.name.toLowerCase() === analysis.suggestedCategory?.toLowerCase());
        if (match) categoryId = match.id;
      }
    }

    // 2) Aks holda, qo'lda kiritilgan ifodadan (masalan "25000*3") summa hisoblanadi
    if (amount === undefined) {
      if (!dto.amountExpression) {
        throw new BadRequestException("Summa yoki chek rasmi kerak");
      }
      amount = TransactionsService.parseAmount(dto.amountExpression);
    }

    const result = await this.transactionsService.create(user.userId, {
      direction: dto.direction,
      balanceType: dto.balanceType,
      paymentType: dto.paymentType,
      category: categoryId,
      amount,
      rawExpression: dto.amountExpression,
      comment: dto.comment,
      occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
      receiptUrl: file ? `/uploads/${file.filename}` : undefined,
      aiAnalysis,
    });

    return result;
  }

  // List page uchun: filtrlar bilan tranzaksiyalar ro'yxati
  @Get()
  findAll(
    @CurrentUser() user,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('balanceType') balanceType?: 'personal' | 'company',
    @Query('direction') direction?: 'income' | 'expense',
    @Query('paymentType') paymentType?: 'cash' | 'card',
    @Query('categories') categories?: string,
  ) {
    return this.transactionsService.findMany(user.userId, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      balanceType,
      direction,
      paymentType,
      categoryIds: categories ? categories.split(',') : undefined,
    });
  }
}
