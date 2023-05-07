import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';

export interface Transactions {
    position: number;
    description: string;
    paymentMode: string;
    date: string;
    creditAmount: number | string;
    debitAmount: number | string;
    runningBalance: number;
}

const ELEMENT_DATA: Transactions[] = [
    {
        position: 1,
        description: 'This is the salary for part-time work',
        paymentMode: 'Gpay',
        date: '25/04/2023',
        creditAmount: 2000,
        debitAmount: '-',
        runningBalance: 2000,
    },
    {
        position: 1,
        description: 'This is the salary for part-time work',
        paymentMode: 'Gpay',
        date: '25/04/2023',
        creditAmount: 2000,
        debitAmount: '-',
        runningBalance: 2000,
    },
    {
        position: 1,
        description: 'This is the salary for part-time work',
        paymentMode: 'Gpay',
        date: '25/04/2023',
        creditAmount: 2000,
        debitAmount: '-',
        runningBalance: 2000,
    },
];
@Component({
    selector: 'app-account-transactions',
    templateUrl: './account-transactions.component.html',
    styleUrls: ['./account-transactions.component.scss'],
})
export class AccountTransactionsComponent implements OnInit {
    constructor(
        private commonService: CommonService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef // public newAccount: NewAccountComponent
    ) {}

    displayedColumns: string[] = [
        'position',
        'description',
        'paymentMode',
        'date',
        'creditAmount',
        'debitAmount',
        'runningBalance',
    ];
    dataSource = ELEMENT_DATA;

    ngOnInit(): void {}

    goToAccStatement() {
        this.router.navigateByUrl('reports/accounts-statement');
    }

    navigateToHome() {
        this.commonService.navigateToHome();
    }
}
