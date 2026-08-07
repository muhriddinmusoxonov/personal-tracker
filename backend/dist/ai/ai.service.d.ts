export interface ReceiptAnalysis {
    amount: number | null;
    merchant: string | null;
    suggestedCategory: string | null;
    date: string | null;
    raw: string;
}
export declare class AiService {
    private readonly logger;
    private client;
    constructor();
    analyzeReceipt(filePath: string, mimeType: string, categoryNames: string[]): Promise<ReceiptAnalysis>;
}
