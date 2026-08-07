import { IsIn, IsOptional, IsString } from 'class-validator';

// multipart/form-data orqali keladigan maydonlar (string sifatida)
export class CreateTransactionDto {
  @IsIn(['income', 'expense'])
  direction: 'income' | 'expense';

  @IsIn(['personal', 'company'])
  balanceType: 'personal' | 'company';

  @IsIn(['cash', 'card'])
  paymentType: 'cash' | 'card';

  @IsOptional()
  @IsString()
  category?: string; // faqat expense uchun

  @IsOptional()
  @IsString()
  amountExpression?: string; // masalan "25000*3", qo'lda kiritilganda

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  occurredAt?: string;

  @IsOptional()
  @IsString()
  useAi?: string; // "true" bo'lsa rasm AI orqali tahlil qilinadi
}
