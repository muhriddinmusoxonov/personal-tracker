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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("./schemas/transaction.schema");
const balances_service_1 = require("../balances/balances.service");
const safe_math_1 = require("../common/safe-math");
let TransactionsService = class TransactionsService {
    constructor(transactionModel, balancesService) {
        this.transactionModel = transactionModel;
        this.balancesService = balancesService;
    }
    async create(userId, params) {
        if (params.direction === 'expense' && !params.category) {
            throw new common_1.BadRequestException("Chiqim uchun category tanlanishi shart");
        }
        if (!params.amount || params.amount <= 0) {
            throw new common_1.BadRequestException("Summa noto'g'ri");
        }
        const transaction = await this.transactionModel.create({
            owner: userId,
            direction: params.direction,
            balanceType: params.balanceType,
            paymentType: params.paymentType,
            category: params.category ? new mongoose_2.Types.ObjectId(params.category) : undefined,
            amount: params.amount,
            rawExpression: params.rawExpression,
            comment: params.comment,
            occurredAt: params.occurredAt || new Date(),
            receiptUrl: params.receiptUrl,
            aiAnalysis: params.aiAnalysis,
        });
        const delta = params.direction === 'income' ? params.amount : -params.amount;
        const balance = await this.balancesService.adjust(userId, params.balanceType, params.paymentType, delta);
        return { transaction, balance: this.balancesService.summarize(balance) };
    }
    static parseAmount(amountExpression) {
        return (0, safe_math_1.safeEvaluate)(amountExpression);
    }
    findMany(userId, filters) {
        const query = { owner: userId };
        if (filters.from || filters.to) {
            query.occurredAt = {};
            if (filters.from)
                query.occurredAt.$gte = filters.from;
            if (filters.to)
                query.occurredAt.$lte = filters.to;
        }
        if (filters.balanceType)
            query.balanceType = filters.balanceType;
        if (filters.direction)
            query.direction = filters.direction;
        if (filters.paymentType)
            query.paymentType = filters.paymentType;
        if (filters.categoryIds && filters.categoryIds.length) {
            query.category = { $in: filters.categoryIds.map((id) => new mongoose_2.Types.ObjectId(id)) };
        }
        return this.transactionModel.find(query).populate('category').sort({ occurredAt: -1 });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        balances_service_1.BalancesService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map