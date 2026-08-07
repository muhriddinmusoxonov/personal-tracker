import { BalancesService } from './balances.service';
export declare class BalancesController {
    private balancesService;
    constructor(balancesService: BalancesService);
    get(user: any): Promise<{
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
    }>;
}
