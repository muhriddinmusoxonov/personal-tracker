import { Model } from 'mongoose';
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
export declare class ReportsService {
    private transactionModel;
    constructor(transactionModel: Model<Transaction>);
    private buildQuery;
    summary(userId: string, filters: ReportFilters): Promise<{
        totalIncome: number;
        totalExpense: number;
        net: number;
        byCategory: {
            name: string;
            icon: string;
            total: number;
        }[];
        count: number;
    }>;
    exportExcel(userId: string, userFullName: string, filters: ReportFilters): Promise<ExcelJS.Buffer>;
}
