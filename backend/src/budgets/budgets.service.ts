import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from './schemas/budget.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';

export interface BudgetInput {
  category?: string;
  balanceType?: 'personal' | 'company';
  amount: number;
}

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  create(userId: string, data: BudgetInput) {
    return this.budgetModel.create({
      owner: userId,
      category: data.category || undefined,
      balanceType: data.balanceType || undefined,
      amount: data.amount,
    });
  }

  // "YYYY-MM" ko'rinishidagi oy uchun barcha byudjetlarni sarflangan summa,
  // qolgan summa va foiz bilan birga qaytaradi.
  async findAllWithProgress(userId: string, month: string) {
    const budgets = await this.budgetModel
      .find({ owner: userId })
      .populate('category')
      .sort({ createdAt: 1 });

    const [year, mon] = month.split('-').map(Number);
    const from = new Date(year, (mon || 1) - 1, 1);
    const to = new Date(year, mon || 1, 1);

    return Promise.all(
      budgets.map(async (b) => {
        const match: any = {
          owner: new Types.ObjectId(userId),
          direction: 'expense',
          occurredAt: { $gte: from, $lt: to },
        };
        const categoryDoc = b.category as any;
        if (categoryDoc?._id) match.category = categoryDoc._id;
        if (b.balanceType) match.balanceType = b.balanceType;

        const agg = await this.transactionModel.aggregate([
          { $match: match },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const spent = agg[0]?.total || 0;

        return {
          _id: b._id,
          category: categoryDoc || null,
          balanceType: b.balanceType || null,
          amount: b.amount,
          spent,
          remaining: b.amount - spent,
          percent: b.amount > 0 ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0,
          overspent: spent > b.amount,
        };
      }),
    );
  }

  async update(userId: string, id: string, data: Partial<BudgetInput>) {
    const set: any = {};
    const unset: any = {};
    if (data.amount !== undefined) set.amount = data.amount;
    if (data.category !== undefined) {
      if (data.category) set.category = data.category;
      else unset.category = 1;
    }
    if (data.balanceType !== undefined) {
      if (data.balanceType) set.balanceType = data.balanceType;
      else unset.balanceType = 1;
    }

    const mongoUpdate: any = {};
    if (Object.keys(set).length) mongoUpdate.$set = set;
    if (Object.keys(unset).length) mongoUpdate.$unset = unset;

    const budget = await this.budgetModel.findOneAndUpdate(
      { _id: id, owner: userId },
      mongoUpdate,
      { new: true },
    );
    if (!budget) throw new NotFoundException('Byudjet topilmadi');
    return budget;
  }

  remove(userId: string, id: string) {
    return this.budgetModel.findOneAndDelete({ _id: id, owner: userId });
  }
}
