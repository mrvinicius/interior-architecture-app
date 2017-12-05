import { BudgetRequest } from './shared/budget-request';

export type State = {
    budgetRequests: BudgetRequest[];
};

export const initState: State = {
    budgetRequests: []
};