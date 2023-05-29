import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-receipt-dialog',
    templateUrl: './receipt-dialog.component.html',
    styleUrls: ['./receipt-dialog.component.scss']


})
export class ReceiptDialogComponent implements OnInit {
    url = environment.BASE_URL;
    imageUrl: any;

    constructor(
        // private _taxService: TaxService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<ReceiptDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.imageUrl = this.data;

        this.imageUrl = this.url + '/' + this.data.imageUrl;
    }

    prinkReceipt() {
        window.print();
    }
}
