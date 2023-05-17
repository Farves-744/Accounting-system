import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { NewAccountComponent } from './components/new-account/new-account.component';
import { ProfitAndLossComponent } from './components/profit-and-loss/profit-and-loss.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { MaterialExampleModule } from 'app/material.module';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ShowDialogComponent } from './components/show-dialog/show-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        ManageAccountComponent,
        NewAccountComponent,
        ProfitAndLossComponent,
        TransactionsComponent,
        DeleteDialogComponent,
        ShowDialogComponent,
    ],
    imports: [
        CommonModule,
        AccountsRoutingModule,
        MaterialExampleModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,

    ],
    providers: [NewAccountComponent],
})
export class AccountsModule { }
