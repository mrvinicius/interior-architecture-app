// export type ShowDetail = { type: 'SHOW_DETAIL', talkId: number };
// // export type Filter = { type: 'FILTER', filters: Filters };
// export type Watch = { type: 'WATCH', talkId: number };
// export type Rate = { type: 'RATE', talkId: number, rating: number };
// export type Unrate = { type: 'UNRATE', payload: { talkId: number, error: any } };

export type RequestBudget = { type: 'REQUEST_BUDGET', payload: {} }
export type LoadBudgetRequests = { type: 'LOAD_BUDGET_REQUESTS', payload: {} }
export type LoadSuppliers = { type: 'LOAD_SUPPLIERS', payload: {} }
export type RemoveBudgetRequest = { type: 'LOAD_BUDGET_REQUESTS', payload: {} }

export type Action = RequestBudget
    | LoadBudgetRequests
    | LoadSuppliers
    | RemoveBudgetRequest;