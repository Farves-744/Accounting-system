export class GetIncomeReports {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
    type: number = 0;
}

export class GetExpenseReports {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
    type: number = 1;
}

export class GetTaxReports {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
    taxStatus: number = null;
}

export class GetAccountName {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
}

export class GetAccountStatement {
    id: number = null;
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
}
