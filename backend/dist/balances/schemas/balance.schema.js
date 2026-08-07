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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceSchema = exports.Balance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Balance = class Balance extends mongoose_2.Document {
};
exports.Balance = Balance;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Balance.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "personalCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "personalCard", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "companyCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Balance.prototype, "companyCard", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'UZS' }),
    __metadata("design:type", String)
], Balance.prototype, "currency", void 0);
exports.Balance = Balance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Balance);
exports.BalanceSchema = mongoose_1.SchemaFactory.createForClass(Balance);
//# sourceMappingURL=balance.schema.js.map