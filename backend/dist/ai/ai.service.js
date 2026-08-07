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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@anthropic-ai/sdk");
const fs = require("fs");
let AiService = AiService_1 = class AiService {
    constructor() {
        this.logger = new common_1.Logger(AiService_1.name);
        this.client = null;
        if (process.env.ANTHROPIC_API_KEY) {
            this.client = new sdk_1.default({ apiKey: process.env.ANTHROPIC_API_KEY });
        }
        else {
            this.logger.warn('ANTHROPIC_API_KEY topilmadi - AI chek tahlili ishlamaydi');
        }
    }
    async analyzeReceipt(filePath, mimeType, categoryNames) {
        if (!this.client) {
            return { amount: null, merchant: null, suggestedCategory: null, date: null, raw: 'AI ulanmagan (ANTHROPIC_API_KEY yo\'q)' };
        }
        const imageBuffer = fs.readFileSync(filePath);
        const base64 = imageBuffer.toString('base64');
        const prompt = `Bu chek yoki to'lov skrinshoti. Quyidagi JSON formatida javob ber, boshqa hech narsa yozma:
{"amount": <raqam yoki null>, "merchant": "<do'kon/xizmat nomi yoki null>", "date": "<sana ISO formatda yoki null>", "suggestedCategory": "<quyidagi ro'yxatdan eng mos keluvchisi>"}
Mavjud categorylar: ${categoryNames.join(', ')}`;
        const response = await this.client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 500,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } },
                        { type: 'text', text: prompt },
                    ],
                },
            ],
        });
        const textBlock = response.content.find((c) => c.type === 'text');
        const raw = textBlock?.text ?? '';
        try {
            const cleaned = raw.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);
            return {
                amount: parsed.amount ?? null,
                merchant: parsed.merchant ?? null,
                suggestedCategory: parsed.suggestedCategory ?? null,
                date: parsed.date ?? null,
                raw,
            };
        }
        catch (e) {
            this.logger.error('AI javobini parse qilishda xatolik', e);
            return { amount: null, merchant: null, suggestedCategory: null, date: null, raw };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map