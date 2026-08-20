import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CategoriesService } from '../categories/categories.service';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { Category } from '../categories/schemas/category.schema';
import { Budget } from '../budgets/schemas/budget.schema';
import { Balance } from '../balances/schemas/balance.schema';
export declare class UsersService {
    private userModel;
    private transactionModel;
    private categoryModel;
    private budgetModel;
    private balanceModel;
    private categoriesService;
    constructor(userModel: Model<User>, transactionModel: Model<Transaction>, categoryModel: Model<Category>, budgetModel: Model<Budget>, balanceModel: Model<Balance>, categoriesService: CategoriesService);
    findByEmail(email: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, User, "findOne", {}>;
    findById(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, User, "findOne", {}>;
    create(data: {
        email: string;
        passwordHash: string;
        fullName: string;
    }): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private verifyPassword;
    private removeReceiptFiles;
    resetData(userId: string, password: string): Promise<{
        success: boolean;
        deleted: {
            transactions: number;
            budgets: number;
            categories: number;
        };
    }>;
    deleteAccount(userId: string, password: string): Promise<{
        success: boolean;
    }>;
}
