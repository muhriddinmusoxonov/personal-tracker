import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Har bir byudjet — muayyan kategoriya (yoki umumiy) uchun oylik xarajat limiti.
// Byudjet bir marta yaratiladi va har oy avtomatik "qayta tiklanadi" —
// sarflangan summa har doim tanlangan oy bo'yicha tranzaksiyalardan hisoblanadi.
@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  // Bo'sh bo'lsa — barcha chiqim kategoriyalarini qamrab oluvchi "Umumiy" byudjet
  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  category?: Types.ObjectId;

  // Bo'sh bo'lsa — Personal va Company ikkalasini ham qamrab oladi
  @Prop({ enum: ['personal', 'company'], required: false })
  balanceType?: string;

  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ default: 'monthly', enum: ['monthly'] })
  period: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
BudgetSchema.index({ owner: 1 });
