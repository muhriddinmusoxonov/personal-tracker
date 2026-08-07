import { Model } from 'mongoose';
import { Balance } from './schemas/balance.schema';
export type BalanceType = 'personal' | 'company';
export type PaymentType = 'cash' | 'card';
export declare class BalancesService {
    private balanceModel;
    constructor(balanceModel: Model<Balance>);
    getOrCreate(userId: string): Promise<import("mongoose").Document<unknown, {}, Balance, {}, {}> & Balance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private fieldFor;
    adjust(userId: string, balanceType: BalanceType, paymentType: PaymentType, amount: number): Promise<import("mongoose").Document<unknown, {}, Balance, {}, {}> & Balance & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    summarize(balance: Balance): {
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
}
