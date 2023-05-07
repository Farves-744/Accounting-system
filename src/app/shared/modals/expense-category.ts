export class AddExpenseCategory {
    categoryName: string;
    categoryType: number = 1;
    userId: number = 4;
}

export class getExpenseCategory {
    search: any = null;
    limit: number = null;
    offset: number = null;
    startDate: number = null;
    endDate: number = null;
    type: number = 1;
    userId: number = null;
}
