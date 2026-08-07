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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const categories_service_1 = require("../categories/categories.service");
const ai_service_1 = require("../ai/ai.service");
let TransactionsController = class TransactionsController {
    constructor(transactionsService, categoriesService, aiService) {
        this.transactionsService = transactionsService;
        this.categoriesService = categoriesService;
        this.aiService = aiService;
    }
    async create(user, dto, file) {
        let amount;
        let aiAnalysis;
        let categoryId = dto.category;
        if (file && dto.useAi === 'true') {
            const categories = await this.categoriesService.findAllForUser(user.userId, dto.direction);
            const analysis = await this.aiService.analyzeReceipt(file.path, file.mimetype, categories.map((c) => c.name));
            aiAnalysis = analysis;
            if (analysis.amount)
                amount = analysis.amount;
            if (!categoryId && analysis.suggestedCategory) {
                const match = categories.find((c) => c.name.toLowerCase() === analysis.suggestedCategory?.toLowerCase());
                if (match)
                    categoryId = match.id;
            }
        }
        if (amount === undefined) {
            if (!dto.amountExpression) {
                throw new common_1.BadRequestException("Summa yoki chek rasmi kerak");
            }
            amount = transactions_service_1.TransactionsService.parseAmount(dto.amountExpression);
        }
        const result = await this.transactionsService.create(user.userId, {
            direction: dto.direction,
            balanceType: dto.balanceType,
            paymentType: dto.paymentType,
            category: categoryId,
            amount,
            rawExpression: dto.amountExpression,
            comment: dto.comment,
            occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
            receiptUrl: file ? `/uploads/${file.filename}` : undefined,
            aiAnalysis,
        });
        return result;
    }
    findAll(user, from, to, balanceType, direction, paymentType, categories) {
        return this.transactionsService.findMany(user.userId, {
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
            balanceType,
            direction,
            paymentType,
            categoryIds: categories ? categories.split(',') : undefined,
        });
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receipt')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('balanceType')),
    __param(4, (0, common_1.Query)('direction')),
    __param(5, (0, common_1.Query)('paymentType')),
    __param(6, (0, common_1.Query)('categories')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAll", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        categories_service_1.CategoriesService,
        ai_service_1.AiService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map