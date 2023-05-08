import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeRoutingModule } from './income-routing.module';
import { AddIncomeComponent } from './components/add-income/add-income.component';
import { IncomeCategoriesComponent } from './components/income-categories/income-categories.component';
import { IncomeCategoriesDialogComponent } from './components/income-categories-dialog/income-categories-dialog.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialExampleModule } from 'app/material.module';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { DatePipe } from '@angular/common';
import { CollectDialogComponent } from './components/collect-dialog/collect-dialog.component';
import { ManageIncomeComponent } from './components/manage-income/manage-income.component';
import { ReceiptDialogComponent } from './components/receipt-dialog/receipt-dialog.component';
import { PaymentDialogComponent } from './components/payment-dialog/payment-dialog.component';
import { DndDirective } from 'app/shared/directives/dnd.directive';

@NgModule({
    declarations: [
        AddIncomeComponent,
        IncomeCategoriesComponent,
        IncomeCategoriesDialogComponent,
        DeleteDialogComponent,
        CollectDialogComponent,
        ManageIncomeComponent,
        ReceiptDialogComponent,
        PaymentDialogComponent,
    ],
    imports: [
        CommonModule,
        IncomeRoutingModule,
        SharedModule,
        MaterialExampleModule,
    ],
    providers: [DatePipe],
})
export class IncomeModule {}
