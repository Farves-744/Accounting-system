import { Component, OnInit } from '@angular/core';

export interface ManageIncome {
    position: number;
    accountName: string;
    paymentMode: string;
    amount: number;
    date: string;
}

const ELEMENT_DATA: ManageIncome[] = [
    {
        position: 1,
        accountName: 'Farves',
        paymentMode: 'Gpay',
        amount: 750,
        date: '23/04/2023',
    },
    {
        position: 2,
        accountName: 'Safiyudeen',
        paymentMode: 'Credit Card',
        amount: 250,
        date: '23/04/2023',
    },
];

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss'],
})
export class PaymentDialogComponent implements OnInit {
    constructor() {}

    displayedColumns: string[] = [
        'position',
        'accountName',
        'paymentMode',
        'amount',
        'date',
    ];
    dataSource = ELEMENT_DATA;

    ngOnInit(): void {}
}
