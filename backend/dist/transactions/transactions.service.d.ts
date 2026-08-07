import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { BalancesService } from '../balances/balances.service';
export interface TransactionFilters {
    from?: Date;
    to?: Date;
    balanceType?: 'personal' | 'company';
    direction?: 'income' | 'expense';
    categoryIds?: string[];
    paymentType?: 'cash' | 'card';
}
export declare class TransactionsService {
    private transactionModel;
    private balancesService;
    constructor(transactionModel: Model<Transaction>, balancesService: BalancesService);
    create(userId: string, params: {
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
    }): Promise<{
        transaction: import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        balance: {
            personal: {
                cash: number;
                card: number;
                total: number;
            };
            company: {
                cash: number;
                card: number;
                total: number;
            };
            grandTotal: number;
        };
    }>;
    static parseAmount(amountExpression: string): number;
    findMany(userId: string, filters: TransactionFilters): import("mongoose").Query<(import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, Transaction, "find", {}>;
}
