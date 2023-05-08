import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseRoutingModule } from './expense-routing.module';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { ExpenseCategoriesComponent } from './components/expense-categories/expense-categories.component';
import { ExpenseCategoriesDialogComponent } from './components/expense-categories-dialog/expense-categories-dialog.component';
import { MaterialExampleModule } from 'app/material.module';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { CollectDialogComponent } from './components/collect-dialog/collect-dialog.component';
import { ManageExpenseComponent } from './components/manage-expense/manage-expense.component';
import { PaymentDialogComponent } from './components/payment-dialog/payment-dialog.component';
import { ReceiptDialogComponent } from './components/receipt-dialog/receipt-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        AddExpenseComponent,
        ExpenseCategoriesComponent,
        ExpenseCategoriesDialogComponent,
        DeleteDialogComponent,
        CollectDialogComponent,
        ManageExpenseComponent,
        PaymentDialogComponent,
        ReceiptDialogComponent,
    ],
    imports: [
        CommonModule,
        ExpenseRoutingModule,
        MaterialExampleModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
    ],
})
export class ExpenseModule {}
