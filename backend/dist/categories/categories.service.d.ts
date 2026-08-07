import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<Category>);
    ensureDefaultsForUser(userId: string): Promise<void>;
    findAllForUser(userId: string, type?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, Category, "find", {}>;
    create(userId: string, data: {
        name: string;
        icon: string;
        type: string;
    }): Promise<import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(userId: string, id: string, data: Partial<{
        name: string;
        icon: string;
        type: string;
    }>): import("mongoose").Query<(import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, Category, "findOneAndUpdate", {}>;
    remove(userId: string, id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, Category, "findOneAndDelete", {}>;
}
