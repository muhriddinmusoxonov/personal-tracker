export declare class CreateTransactionDto {
    direction: 'income' | 'expense';
    balanceType: 'personal' | 'company';
    paymentType: 'cash' | 'card';
    category?: string;
    amountExpression?: string;
    comment?: string;
    occurredAt?: string;
    useAi?: string;
}
