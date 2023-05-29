import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'app/shared/services/common.service';
import { ReportsService } from 'app/shared/services/reports.service';

@Component({
    selector: 'app-payment-dialog',
    templateUrl: './payment-dialog.component.html',
    styleUrls: ['./payment-dialog.component.scss']


})
export class PaymentDialogComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    userId: any;
    displayedColumns: string[] = [
        'position',
        'accountName',
        'paymentMode',
        'amount',
        'date',
    ];

    constructor(
        private _reportService: ReportsService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<PaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        private data: any
    ) { }

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        console.log(this.data);
        setTimeout(() => {
            this.getPaymentById(this.data);
        });
    }

    getPaymentById(id: number) {
        const req = {
            id: JSON.parse(JSON.stringify(id)).id,
            userId: this.userId,
        };
        console.log(req);

        this._reportService.getIncomeReportsById(req).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.dataSource = new MatTableDataSource(
                this._commonService.decryptData(res)
            );

            this.dataSource.paginator = this.paginator;
        });
    }
}
