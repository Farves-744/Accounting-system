export class PaymentModel {
    amount: number[] = [];
    accountId: number[] = [];
    paymentMode: number[] = [];
}

export class getExpense {
    search: any = null;
    limit: number = null;
    startDate: number = null;
    endDate: number = null;
    offset: number = null;
    type: number = 1;
    userId: number = null;
}
