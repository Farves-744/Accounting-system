import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ExpenseReceiptDialogComponent } from '../expense-receipt-dialog/expense-receipt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpensePaymentDialogComponent } from '../expense-payment-dialog/expense-payment-dialog.component';

export interface ManageExpense {
    position: number;
    imgUrl: string;
    categoryName: string;
    description: string;
    date: string;
    taxAmount: number;
    amount: number;
}

const ELEMENT_DATA: ManageExpense[] = [
    {
        position: 1,
        imgUrl: 'assets/images/salary.png',
        categoryName: 'Salaries',
        description: 'Salaries',
        date: '23/04/2023',
        taxAmount: 1000,
        amount: 10000,
    },
    {
        position: 2,
        imgUrl: 'assets/images/utilities.png',
        categoryName: 'Utilities',
        description: 'Utilities',
        date: '23/04/2023',
        taxAmount: 500,
        amount: 15000,
    },
    {
        position: 3,
        imgUrl: 'assets/images/rent.png',
        categoryName: 'Rent',
        description: 'Rent',
        date: '23/04/2023',
        taxAmount: 750,
        amount: 7000,
    },
];
@Component({
    selector: 'app-expense-report',
    templateUrl: './expense-report.component.html',
    styleUrls: ['./expense-report.component.scss'],
})
export class ExpenseReportComponent implements OnInit {
    constructor(
        private router: Router,
        private commonService: CommonService,
        public dialog: MatDialog
    ) {}

    displayedColumns: string[] = [
        'position',
        'categoryName',
        'description',
        'date',
        'taxAmount',
        'amount',
        'receipt',
        'details',
    ];
    dataSource = ELEMENT_DATA;

    navigateToHome() {
        this.commonService.navigateToHome();
    }

    ngOnInit(): void {}

    openReceiptDialog() {
        const dialogRef = this.dialog.open(ExpenseReceiptDialogComponent, {
            width: '900px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    openPaymentDialog() {
        const dialogRef = this.dialog.open(ExpensePaymentDialogComponent, {
            width: '900px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }
}
