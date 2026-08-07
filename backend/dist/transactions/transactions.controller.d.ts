import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoriesService } from '../categories/categories.service';
import { AiService } from '../ai/ai.service';
export declare class TransactionsController {
    private transactionsService;
    private categoriesService;
    private aiService;
    constructor(transactionsService: TransactionsService, categoriesService: CategoriesService, aiService: AiService);
    create(user: any, dto: CreateTransactionDto, file?: Express.Multer.File): Promise<{
        transaction: import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction, {}, {}> & import("./schemas/transaction.schema").Transaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        balance: {
            personal: {
                cash: number;
                card: number;
                total: number;
            };
            company: {
                cash: number;
                card: number;
                total: number;
            };
            grandTotal: number;
        };
    }>;
    findAll(user: any, from?: string, to?: string, balanceType?: 'personal' | 'company', direction?: 'income' | 'expense', paymentType?: 'cash' | 'card', categories?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction, {}, {}> & import("./schemas/transaction.schema").Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/transaction.schema").Transaction, {}, {}> & import("./schemas/transaction.schema").Transaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, import("./schemas/transaction.schema").Transaction, "find", {}>;
}
