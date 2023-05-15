export class GetAccounts {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
}

export class AddAccount {
    accountName: string;
    accountNo: string;
    bankName: string;
    accountType: number;
    ifscCode: string;
    initialAmount?: number;
    userId: number;
}

export class GetTransactions {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    userId: number = null;
}

export class GetProfitAndLoss {
    startDate: number = null;
    endDate: number = null;
    userId: number = null;
}

export class ProfitAndLossData {
    loss: number = null;
    profit: number = null;
    totalIncome: number = null;
    totalExpense: number = null;
}
