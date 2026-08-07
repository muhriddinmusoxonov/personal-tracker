import { Document, Types } from 'mongoose';
export declare class Balance extends Document {
    owner: Types.ObjectId;
    personalCash: number;
    personalCard: number;
    companyCash: number;
    companyCard: number;
    currency: string;
}
export declare const BalanceSchema: import("mongoose").Schema<Balance, import("mongoose").Model<Balance, any, any, any, Document<unknown, any, Balance, any, {}> & Balance & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Balance, Document<unknown, {}, import("mongoose").FlatRecord<Balance>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Balance> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
