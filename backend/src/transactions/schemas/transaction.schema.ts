import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true, enum: ['income', 'expense'] })
  direction: string; // kirim | chiqim

  @Prop({ required: true, enum: ['personal', 'company'] })
  balanceType: string;

  @Prop({ required: true, enum: ['cash', 'card'] })
  paymentType: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  category: Types.ObjectId; // faqat expense uchun majburiy, income uchun bo'sh bo'lishi mumkin

  @Prop({ required: true })
  amount: number;

  @Prop()
  rawExpression: string; // masalan "25000*3" - foydalanuvchi kiritgan ifoda

  @Prop()
  comment: string;

  @Prop()
  receiptUrl: string; // yuklangan chek/skrinshot fayl manzili

  @Prop({ type: Object })
  aiAnalysis: Record<string, any>; // Claude Vision tomonidan aniqlangan ma'lumotlar

  @Prop({ required: true, default: Date.now })
  occurredAt: Date; // soniyagacha aniq vaqt
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ owner: 1, occurredAt: -1 });
TransactionSchema.index({ owner: 1, balanceType: 1, direction: 1 });
TransactionSchema.index({ owner: 1, category: 1 });
