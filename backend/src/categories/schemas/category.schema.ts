import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string; // masalan: Sport, Transport, Pitaniya, Clothes

  @Prop({ required: true, default: 'tag' })
  icon: string; // ikon nomi (frontendda lucide-icon nomi sifatida ishlatiladi)

  @Prop({ required: true, enum: ['income', 'expense', 'both'], default: 'expense' })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ default: false })
  isDefault: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
