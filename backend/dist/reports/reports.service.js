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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ExcelJS = require("exceljs");
const transaction_schema_1 = require("../transactions/schemas/transaction.schema");
let ReportsService = class ReportsService {
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    buildQuery(userId, filters) {
        const query = {
            owner: userId,
            occurredAt: { $gte: filters.from, $lte: filters.to },
        };
        if (filters.balanceType)
            query.balanceType = filters.balanceType;
        if (filters.direction)
            query.direction = filters.direction;
        if (filters.paymentType)
            query.paymentType = filters.paymentType;
        if (filters.categoryIds && filters.categoryIds.length) {
            query.category = { $in: filters.categoryIds.map((id) => new mongoose_2.Types.ObjectId(id)) };
        }
        return query;
    }
    async summary(userId, filters) {
        const query = this.buildQuery(userId, filters);
        const transactions = await this.transactionModel.find(query).populate('category');
        let totalIncome = 0;
        let totalExpense = 0;
        const byCategory = new Map();
        for (const t of transactions) {
            if (t.direction === 'income')
                totalIncome += t.amount;
            else
                totalExpense += t.amount;
            if (t.direction === 'expense' && t.category) {
                const cat = t.category;
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
    async exportExcel(userId, userFullName, filters) {
        const query = this.buildQuery(userId, filters);
        const transactions = await this.transactionModel.find(query).populate('category').sort({ occurredAt: 1 });
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
                category: t.category?.name || '-',
                amount: t.amount,
                paymentType: t.paymentType === 'cash' ? 'Naqd' : 'Karta',
                balanceType: t.balanceType === 'personal' ? 'Personal' : 'Company',
                comment: t.comment || '',
                receipt: t.receiptUrl || '',
            });
        }
        return workbook.xlsx.writeBuffer();
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map