import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Balance } from './schemas/balance.schema';

export type BalanceType = 'personal' | 'company';
export type PaymentType = 'cash' | 'card';

@Injectable()
export class BalancesService {
  constructor(@InjectModel(Balance.name) private balanceModel: Model<Balance>) {}

  async getOrCreate(userId: string) {
    let balance = await this.balanceModel.findOne({ owner: userId });
    if (!balance) {
      balance = await this.balanceModel.create({ owner: userId });
    }
    return balance;
  }

  private fieldFor(balanceType: BalanceType, paymentType: PaymentType) {
    return `${balanceType}${paymentType === 'cash' ? 'Cash' : 'Card'}`; // masalan personalCash
  }

  // amount musbat bo'lsa qo'shadi (kirim), manfiy bo'lsa ayiradi (chiqim)
  async adjust(userId: string, balanceType: BalanceType, paymentType: PaymentType, amount: number) {
    const field = this.fieldFor(balanceType, paymentType);
    await this.balanceModel.updateOne({ owner: userId }, { $inc: { [field]: amount } }, { upsert: true });
    return this.getOrCreate(userId);
  }

  summarize(balance: Balance) {
    return {
      personal: {
        cash: balance.personalCash,
        card: balance.personalCard,
        total: balance.personalCash + balance.personalCard,
      },
      company: {
        cash: balance.companyCash,
        card: balance.companyCard,
        total: balance.companyCash + balance.companyCard,
      },
      grandTotal:
        balance.personalCash + balance.personalCard + balance.companyCash + balance.companyCard,
    };
  }
}
