import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

const DEFAULT_CATEGORIES = [
  { name: 'Sport', icon: 'dumbbell', type: 'expense' },
  { name: 'Pitaniya', icon: 'utensils', type: 'expense' },
  { name: 'Transport', icon: 'car', type: 'expense' },
  { name: 'Clothes', icon: 'shirt', type: 'expense' },
  { name: 'Kommunal', icon: 'home', type: 'expense' },
  { name: 'Salomatlik', icon: 'heart-pulse', type: 'expense' },
  { name: "Ko'ngilochar", icon: 'popcorn', type: 'expense' },
  { name: "Oylik / Maosh", icon: 'wallet', type: 'income' },
  { name: 'Boshqa', icon: 'more-horizontal', type: 'both' },
];

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async ensureDefaultsForUser(userId: string) {
    const existing = await this.categoryModel.countDocuments({ owner: userId, isDefault: true });
    if (existing > 0) return;
    await this.categoryModel.insertMany(
      DEFAULT_CATEGORIES.map((c) => ({ ...c, owner: userId, isDefault: true })),
    );
  }

  findAllForUser(userId: string, type?: string) {
    const filter: any = { owner: userId };
    if (type) filter.type = { $in: [type, 'both'] };
    return this.categoryModel.find(filter).sort({ createdAt: 1 });
  }

  create(userId: string, data: { name: string; icon: string; type: string }) {
    return this.categoryModel.create({ ...data, owner: userId, isDefault: false });
  }

  update(userId: string, id: string, data: Partial<{ name: string; icon: string; type: string }>) {
    return this.categoryModel.findOneAndUpdate({ _id: id, owner: userId }, data, { new: true });
  }

  remove(userId: string, id: string) {
    return this.categoryModel.findOneAndDelete({ _id: id, owner: userId, isDefault: false });
  }
}
