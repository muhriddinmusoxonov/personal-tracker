import { Document, Types } from 'mongoose';
export declare class Transaction extends Document {
    owner: Types.ObjectId;
    direction: string;
    balanceType: string;
    paymentType: string;
    category: Types.ObjectId;
    amount: number;
    rawExpression: string;
    comment: string;
    receiptUrl: string;
    aiAnalysis: Record<string, any>;
    occurredAt: Date;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Transaction> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
