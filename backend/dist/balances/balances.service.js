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
exports.BalancesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const balance_schema_1 = require("./schemas/balance.schema");
let BalancesService = class BalancesService {
    constructor(balanceModel) {
        this.balanceModel = balanceModel;
    }
    async getOrCreate(userId) {
        let balance = await this.balanceModel.findOne({ owner: userId });
        if (!balance) {
            balance = await this.balanceModel.create({ owner: userId });
        }
        return balance;
    }
    fieldFor(balanceType, paymentType) {
        return `${balanceType}${paymentType === 'cash' ? 'Cash' : 'Card'}`;
    }
    async adjust(userId, balanceType, paymentType, amount) {
        const field = this.fieldFor(balanceType, paymentType);
        await this.balanceModel.updateOne({ owner: userId }, { $inc: { [field]: amount } }, { upsert: true });
        return this.getOrCreate(userId);
    }
    summarize(balance) {
        return {
            personal: {
                cash: balance.personalCash,
                card: balance.personalCard,
                total: balance.personalCash + balance.personalCard,
            },
            company: {
                cash: balance.companyCash,
                card: balance.companyCard,
                total: balance.companyCash + balance.companyCard,
            },
            grandTotal: balance.personalCash + balance.personalCard + balance.companyCash + balance.companyCard,
        };
    }
};
exports.BalancesService = BalancesService;
exports.BalancesService = BalancesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(balance_schema_1.Balance.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BalancesService);
//# sourceMappingURL=balances.service.js.map