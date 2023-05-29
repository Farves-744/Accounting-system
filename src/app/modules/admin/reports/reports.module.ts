import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { AccountsStatementComponent } from './components/accounts-statement/accounts-statement.component';
import { ExpenseReportComponent } from './components/expense-report/expense-report.component';
import { IncomeReportComponent } from './components/income-report/income-report.component';
import { TaxReportComponent } from './components/tax-report/tax-report.component';
import { MaterialExampleModule } from 'app/material.module';
import { ReceiptDialogComponent } from './components/receipt-dialog/receipt-dialog.component';
import { PaymentDialogComponent } from './components/payment-dialog/payment-dialog.component';
import { ExpensePaymentDialogComponent } from './components/expense-payment-dialog/expense-payment-dialog.component';
import { ExpenseReceiptDialogComponent } from './components/expense-receipt-dialog/expense-receipt-dialog.component';
import { AccountTransactionsComponent } from './components/account-transactions/account-transactions.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        AccountsStatementComponent,
        ExpenseReportComponent,
        IncomeReportComponent,
        TaxReportComponent,
        ReceiptDialogComponent,
        PaymentDialogComponent,
        ExpensePaymentDialogComponent,
        ExpenseReceiptDialogComponent,
        AccountTransactionsComponent,
    ],

    imports: [
        CommonModule,
        ReportsRoutingModule,
        MaterialExampleModule,
        FormsModule,
        SharedModule,
    ],
    providers: [DatePipe]
})
export class ReportsModule { }
