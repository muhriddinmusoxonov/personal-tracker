import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { existsSync, unlinkSync } from 'fs';
import { basename, resolve } from 'path';
import { User } from './schemas/user.schema';
import { CategoriesService } from '../categories/categories.service';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { Category } from '../categories/schemas/category.schema';
import { Budget } from '../budgets/schemas/budget.schema';
import { Balance } from '../balances/schemas/balance.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
    @InjectModel(Balance.name) private balanceModel: Model<Balance>,
    private categoriesService: CategoriesService,
  ) {}

  findByEmail(email: string) { return this.userModel.findOne({ email: email.toLowerCase() }); }
  findById(id: string) { return this.userModel.findById(id); }
  create(data: { email: string; passwordHash: string; fullName: string }) { return this.userModel.create(data); }

  private async verifyPassword(userId: string, password: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Profile not found');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('INVALID_PASSWORD');
    return user;
  }

  private async removeReceiptFiles(userId: string) {
    const transactions = await this.transactionModel.find({ owner: { $in: [new Types.ObjectId(userId), userId] } }).select('receiptUrl').lean();
    const uploadDir = resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
    for (const tx of transactions) {
      if (!tx.receiptUrl) continue;
      const file = resolve(uploadDir, basename(tx.receiptUrl));
      try { if (existsSync(file)) unlinkSync(file); } catch { /* file may already be gone */ }
    }
  }

  async resetData(userId: string, password: string) {
    await this.verifyPassword(userId, password);
    const owner = new Types.ObjectId(userId);
    // Older versions of this project could store owner as a plain string.
    // Match both forms so reset also removes legacy data.
    const ownerFilter = { owner: { $in: [owner, userId] } };

    // Remove every piece of user data. Do this sequentially so the result is
    // deterministic and so we can return exactly what was deleted.
    await this.removeReceiptFiles(userId);

    const transactionsResult = await this.transactionModel.deleteMany(ownerFilter);
    const budgetsResult = await this.budgetModel.deleteMany(ownerFilter);
    const categoriesResult = await this.categoryModel.deleteMany(ownerFilter);

    // Remove legacy and current balance documents, then create one clean balance.
    // This avoids a legacy string-owner document surviving the reset.
    await this.balanceModel.deleteMany(ownerFilter);
    await this.balanceModel.create({
      owner,
      personalCash: 0,
      personalCard: 0,
      companyCash: 0,
      companyCard: 0,
      currency: 'UZS',
    });

    // Only the standard categories are recreated. They contain no user data.
    await this.categoriesService.ensureDefaultsForUser(userId);

    return {
      success: true,
      deleted: {
        transactions: transactionsResult.deletedCount || 0,
        budgets: budgetsResult.deletedCount || 0,
        categories: categoriesResult.deletedCount || 0,
      },
    };
  }

  async deleteAccount(userId: string, password: string) {
    await this.verifyPassword(userId, password);
    const owner = new Types.ObjectId(userId);
    const ownerFilter = { owner: { $in: [owner, userId] } };
    await this.removeReceiptFiles(userId);
    await Promise.all([
      this.transactionModel.deleteMany(ownerFilter),
      this.categoryModel.deleteMany(ownerFilter),
      this.budgetModel.deleteMany(ownerFilter),
      this.balanceModel.deleteMany(ownerFilter),
    ]);
    await this.userModel.deleteOne({ _id: owner });
    return { success: true };
  }
}
