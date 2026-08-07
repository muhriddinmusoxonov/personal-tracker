import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    private parseFilters;
    summary(user: any, query: any): Promise<{
        totalIncome: number;
        totalExpense: number;
        net: number;
        byCategory: {
            name: string;
            icon: string;
            total: number;
        }[];
        count: number;
    }>;
    export(user: any, query: any, res: Response): Promise<void>;
}
