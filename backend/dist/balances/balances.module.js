"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const balance_schema_1 = require("./schemas/balance.schema");
const balances_service_1 = require("./balances.service");
const balances_controller_1 = require("./balances.controller");
let BalancesModule = class BalancesModule {
};
exports.BalancesModule = BalancesModule;
exports.BalancesModule = BalancesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: balance_schema_1.Balance.name, schema: balance_schema_1.BalanceSchema }])],
        providers: [balances_service_1.BalancesService],
        controllers: [balances_controller_1.BalancesController],
        exports: [balances_service_1.BalancesService],
    })
], BalancesModule);
//# sourceMappingURL=balances.module.js.map