import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';

export interface ReceiptAnalysis {
  amount: number | null;
  merchant: string | null;
  suggestedCategory: string | null;
  date: string | null;
  raw: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private client: Anthropic | null = null;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    } else {
      this.logger.warn('ANTHROPIC_API_KEY topilmadi - AI chek tahlili ishlamaydi');
    }
  }

  // Chek/skrinshot rasmini Claude Vision orqali tahlil qiladi va
  // summani, do'kon nomini va mos category'ni taxmin qiladi.
  async analyzeReceipt(filePath: string, mimeType: string, categoryNames: string[]): Promise<ReceiptAnalysis> {
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
            { type: 'image', source: { type: 'base64', media_type: mimeType as any, data: base64 } },
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    const textBlock = response.content.find((c: any) => c.type === 'text') as any;
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
    } catch (e) {
      this.logger.error('AI javobini parse qilishda xatolik', e);
      return { amount: null, merchant: null, suggestedCategory: null, date: null, raw };
    }
  }
}
