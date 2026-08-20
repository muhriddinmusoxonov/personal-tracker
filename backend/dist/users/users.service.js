"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const fs_1 = require("fs");
const path_1 = require("path");
const user_schema_1 = require("./schemas/user.schema");
const categories_service_1 = require("../categories/categories.service");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
const category_schema_1 = require("../categories/schemas/category.schema");
const budget_schema_1 = require("../budgets/schemas/budget.schema");
const balance_schema_1 = require("../balances/schemas/balance.schema");
let UsersService = class UsersService {
    constructor(userModel, transactionModel, categoryModel, budgetModel, balanceModel, categoriesService) {
        this.userModel = userModel;
        this.transactionModel = transactionModel;
        this.categoryModel = categoryModel;
        this.budgetModel = budgetModel;
        this.balanceModel = balanceModel;
        this.categoriesService = categoriesService;
    }
    findByEmail(email) { return this.userModel.findOne({ email: email.toLowerCase() }); }
    findById(id) { return this.userModel.findById(id); }
    create(data) { return this.userModel.create(data); }
    async verifyPassword(userId, password) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('Profile not found');
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('INVALID_PASSWORD');
        return user;
    }
    async removeReceiptFiles(userId) {
        const transactions = await this.transactionModel.find({ owner: { $in: [new mongoose_2.Types.ObjectId(userId), userId] } }).select('receiptUrl').lean();
        const uploadDir = (0, path_1.resolve)(process.cwd(), process.env.UPLOAD_DIR || './uploads');
        for (const tx of transactions) {
            if (!tx.receiptUrl)
                continue;
            const file = (0, path_1.resolve)(uploadDir, (0, path_1.basename)(tx.receiptUrl));
            try {
                if ((0, fs_1.existsSync)(file))
                    (0, fs_1.unlinkSync)(file);
            }
            catch { }
        }
    }
    async resetData(userId, password) {
        await this.verifyPassword(userId, password);
        const owner = new mongoose_2.Types.ObjectId(userId);
        const ownerFilter = { owner: { $in: [owner, userId] } };
        await this.removeReceiptFiles(userId);
        const transactionsResult = await this.transactionModel.deleteMany(ownerFilter);
        const budgetsResult = await this.budgetModel.deleteMany(ownerFilter);
        const categoriesResult = await this.categoryModel.deleteMany(ownerFilter);
        await this.balanceModel.deleteMany(ownerFilter);
        await this.balanceModel.create({
            owner,
            personalCash: 0,
            personalCard: 0,
            companyCash: 0,
            companyCard: 0,
            currency: 'UZS',
        });
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
    async deleteAccount(userId, password) {
        await this.verifyPassword(userId, password);
        const owner = new mongoose_2.Types.ObjectId(userId);
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(2, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(3, (0, mongoose_1.InjectModel)(budget_schema_1.Budget.name)),
    __param(4, (0, mongoose_1.InjectModel)(balance_schema_1.Balance.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        categories_service_1.CategoriesService])
], UsersService);
//# sourceMappingURL=users.service.js.map