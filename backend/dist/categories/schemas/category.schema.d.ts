import { Document, Types } from 'mongoose';
export declare class Category extends Document {
    name: string;
    icon: string;
    type: string;
    owner: Types.ObjectId;
    isDefault: boolean;
}
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, Document<unknown, any, Category, any, {}> & Category & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, Document<unknown, {}, import("mongoose").FlatRecord<Category>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Category> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
