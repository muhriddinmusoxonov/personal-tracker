import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Har bir foydalanuvchi uchun bitta Balance hujjati.
// Personal va Company balanslari o'z ichida cash/card bo'linmalariga ega.
@Schema({ timestamps: true })
export class Balance extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  owner: Types.ObjectId;

  @Prop({ default: 0 })
  personalCash: number;

  @Prop({ default: 0 })
  personalCard: number;

  @Prop({ default: 0 })
  companyCash: number;

  @Prop({ default: 0 })
  companyCard: number;

  @Prop({ default: 'UZS' })
  currency: string;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
