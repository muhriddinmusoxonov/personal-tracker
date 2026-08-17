import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { BalancesService } from '../balances/balances.service';
import { safeEvaluate } from '../common/safe-math';

export interface TransactionFilters {
  from?: Date;
  to?: Date;
  balanceType?: 'personal' | 'company';
  direction?: 'income' | 'expense';
  categoryIds?: string[];
  paymentType?: 'cash' | 'card';
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private balancesService: BalancesService,
  ) {}

  async create(userId: string, params: {
    direction: 'income' | 'expense';
    balanceType: 'personal' | 'company';
    paymentType: 'cash' | 'card';
    category?: string;
    amount: number;
    rawExpression?: string;
    comment?: string;
    occurredAt?: Date;
    receiptUrl?: string;
    aiAnalysis?: Record<string, any>;
  }) {
    if (params.direction === 'expense' && !params.category) {
      throw new BadRequestException("Chiqim uchun category tanlanishi shart");
    }
    if (!params.amount || params.amount <= 0) {
      throw new BadRequestException("Summa noto'g'ri");
    }

    // Kirim tranzaksiyalarida category bo'lishi mumkin emas — qanday kelib qolishidan
    // qat'i nazar (frontenddan eskirib qolgan qiymat, AI tahlili va h.k.) shu yerda tozalanadi.
    const category = params.direction === 'expense' && params.category
      ? new Types.ObjectId(params.category)
      : undefined;

    const transaction = await this.transactionModel.create({
      owner: userId,
      direction: params.direction,
      balanceType: params.balanceType,
      paymentType: params.paymentType,
      category,
      amount: params.amount,
      rawExpression: params.rawExpression,
      comment: params.comment,
      occurredAt: params.occurredAt || new Date(),
      receiptUrl: params.receiptUrl,
      aiAnalysis: params.aiAnalysis,
    });

    // Balансni yangilash: income -> qo'shiladi, expense -> ayiriladi
    const delta = params.direction === 'income' ? params.amount : -params.amount;
    const balance = await this.balancesService.adjust(userId, params.balanceType, params.paymentType, delta);

    return { transaction, balance: this.balancesService.summarize(balance) };
  }

  static parseAmount(amountExpression: string): number {
    return safeEvaluate(amountExpression);
  }

  findMany(userId: string, filters: TransactionFilters) {
    const query: any = { owner: userId };
    if (filters.from || filters.to) {
      query.occurredAt = {};
      if (filters.from) query.occurredAt.$gte = filters.from;
      if (filters.to) query.occurredAt.$lte = filters.to;
    }
    if (filters.balanceType) query.balanceType = filters.balanceType;
    if (filters.direction) query.direction = filters.direction;
    if (filters.paymentType) query.paymentType = filters.paymentType;
    if (filters.categoryIds && filters.categoryIds.length) {
      query.category = { $in: filters.categoryIds.map((id) => new Types.ObjectId(id)) };
    }
    return this.transactionModel.find(query).populate('category').sort({ occurredAt: -1 });
  }
}
