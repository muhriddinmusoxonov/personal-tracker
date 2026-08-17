import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { Transaction } from '../transactions/schemas/transaction.schema';

export interface ReportFilters {
  from: Date;
  to: Date;
  balanceType?: 'personal' | 'company';
  direction?: 'income' | 'expense';
  categoryIds?: string[];
  paymentType?: 'cash' | 'card';
}

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

  private buildQuery(userId: string, filters: ReportFilters) {
    const query: any = {
      owner: userId,
      occurredAt: { $gte: filters.from, $lte: filters.to },
    };
    if (filters.balanceType) query.balanceType = filters.balanceType;
    if (filters.direction) query.direction = filters.direction;
    if (filters.paymentType) query.paymentType = filters.paymentType;
    if (filters.categoryIds && filters.categoryIds.length) {
      query.category = { $in: filters.categoryIds.map((id) => new Types.ObjectId(id)) };
    }
    return query;
  }

  // Dashboard uchun: category bo'yicha guruhlangan summalar + umumiy kirim/chiqim/balans
  async summary(userId: string, filters: ReportFilters) {
    const query = this.buildQuery(userId, filters);
    const transactions = await this.transactionModel.find(query).populate('category');

    let totalIncome = 0;
    let totalExpense = 0;
    const byCategory = new Map<string, { name: string; icon: string; total: number }>();

    for (const t of transactions) {
      if (t.direction === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;

      if (t.direction === 'expense' && t.category) {
        const cat = t.category as any;
        const key = cat._id.toString();
        const entry = byCategory.get(key) || { name: cat.name, icon: cat.icon, total: 0 };
        entry.total += t.amount;
        byCategory.set(key, entry);
      }
    }

    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      byCategory: Array.from(byCategory.values()),
      count: transactions.length,
    };
  }

  // Excel fayl generatsiya qilish (buffer qaytaradi)
  async exportExcel(userId: string, userFullName: string, filters: ReportFilters): Promise<ExcelJS.Buffer> {
    const query = this.buildQuery(userId, filters);
    const transactions = await this.transactionModel.find(query).populate('category').sort({ occurredAt: 1 });

    // Debug: filtr bo'yicha nechta tranzaksiya topilganini konsolga chiqaramiz.
    // Agar bu son kutilganidan kam bo'lsa (masalan doim 1), muammo query/DB tomonda,
    // agar to'g'ri son chiqsa-yu Excelda 1 ta qator ko'rinsa, muammo Excel generatsiyasida emas.
    console.log(`[reports.exportExcel] owner=${userId} from=${filters.from?.toISOString()} to=${filters.to?.toISOString()} topildi=${transactions.length}`);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hisobot');

    sheet.columns = [
      { header: 'Foydalanuvchi', key: 'user', width: 20 },
      { header: 'Sana va vaqt', key: 'datetime', width: 22 },
      { header: 'Turi (Kirim/Chiqim)', key: 'direction', width: 18 },
      { header: 'Category', key: 'category', width: 16 },
      { header: "Miqdor", key: 'amount', width: 14 },
      { header: "To'lov turi", key: 'paymentType', width: 14 },
      { header: 'Balance', key: 'balanceType', width: 14 },
      { header: 'Izoh', key: 'comment', width: 24 },
      { header: 'Chek rasmi', key: 'receipt', width: 30 },
    ];
    sheet.getRow(1).font = { bold: true };

    for (const t of transactions) {
      sheet.addRow({
        user: userFullName,
        datetime: new Date(t.occurredAt).toLocaleString('sv-SE', { timeZone: 'Asia/Tashkent' }),
        direction: t.direction === 'income' ? 'Kirim' : 'Chiqim',
        category: (t.category as any)?.name || '-',
        amount: t.amount,
        paymentType: t.paymentType === 'cash' ? 'Naqd' : 'Karta',
        balanceType: t.balanceType === 'personal' ? 'Personal' : 'Company',
        comment: t.comment || '',
        receipt: t.receiptUrl || '',
      });
    }

    return workbook.xlsx.writeBuffer();
  }
}
