import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxRoutingModule } from './tax-routing.module';
import { AddTaxComponent } from './components/add-tax/add-tax.component';
import { ManageTaxComponent } from './components/manage-tax/manage-tax.component';
import { TaxStatementComponent } from './components/tax-statement/tax-statement.component';
import { MaterialExampleModule } from 'app/material.module';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { NewAccountComponent } from '../accounts/components/new-account/new-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        AddTaxComponent,
        ManageTaxComponent,
        TaxStatementComponent,
        DeleteDialogComponent,
    ],
    imports: [
        CommonModule,
        TaxRoutingModule,
        MaterialExampleModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    providers: [NewAccountComponent],
})
export class TaxModule { }
