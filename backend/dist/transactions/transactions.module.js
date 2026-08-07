"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const transaction_schema_1 = require("./schemas/transaction.schema");
const transactions_service_1 = require("./transactions.service");
const transactions_controller_1 = require("./transactions.controller");
const balances_module_1 = require("../balances/balances.module");
const categories_module_1 = require("../categories/categories.module");
const ai_module_1 = require("../ai/ai.module");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema }]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: process.env.UPLOAD_DIR || './uploads',
                    filename: (req, file, cb) => {
                        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                        cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
                    },
                }),
                limits: { fileSize: 10 * 1024 * 1024 },
            }),
            balances_module_1.BalancesModule,
            categories_module_1.CategoriesModule,
            ai_module_1.AiModule,
        ],
        providers: [transactions_service_1.TransactionsService],
        controllers: [transactions_controller_1.TransactionsController],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map