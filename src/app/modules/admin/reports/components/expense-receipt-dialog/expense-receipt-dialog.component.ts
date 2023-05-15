import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-expense-receipt-dialog',
    templateUrl: './expense-receipt-dialog.component.html',
    styleUrls: ['./expense-receipt-dialog.component.scss'],
})
export class ExpenseReceiptDialogComponent implements OnInit {
    url = environment.BASE_URL;
    imageUrl: any;

    constructor(
        // private _taxService: TaxService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<ExpenseReceiptDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    ngOnInit(): void {
        this.imageUrl = this.data;

        this.imageUrl = this.url + '/' + this.data.imageUrl;
    }

    prinkReceipt() {
        window.print();
    }
}
