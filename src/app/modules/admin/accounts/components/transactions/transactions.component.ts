import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { GetTransactions } from 'app/shared/modals/accounts';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';
import { environment } from 'environments/environment';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']


})
export class TransactionsComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getTransactionsModal: GetTransactions = new GetTransactions();
    // categoryData: any;
    url = environment.BASE_URL;

    dashboardAccess: any

    cols: any[];
    exportColumns;
    transactionsData: any

    constructor(
        private _commonService: CommonService,
        private _accountService: AccountService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    displayedColumns: string[] = [
        'position',
        'holderName',
        'paymentMode',
        'date',
        'creditAmount',
        'debitAmount',
        'incluExclu',
        'taxRate',
        'taxAmount',
        'description',
        'runningBalance',
    ];

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    ngOnInit(): void {
        this.getTransactionsModal.userId = this._commonService.getUserId();

        this.getTransactions();

        this.cols = [
            { field: "sn", header: "SN" },
            { field: "holderName", header: "HOLDER NAME" },
            { field: "paymentMode", header: "PAYMENT MODE" },
            { field: "actualDate", header: "DATE" },
            { field: "credit", header: "CREDIT AMOUNT" },
            { field: "debit", header: "DEBIT AMOUNT" },
            { field: "taxStatus", header: "INCLU / EXCLU" },
            { field: "taxRate", header: "TAX RATE" },
            { field: "taxAmount", header: "TAX AMOUNT" },
            { field: "description", header: "DESCRIPTION" },
            { field: "runningBalance", header: "BALANCE" },
        ];

        this.exportColumns = this.cols.map(col => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchTransactions(event: any) {
        this.getTransactionsModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getTransactions();
    }

    filterBy = [
        { name: 'Included', id: 1 },
        { name: 'Excluded', id: 2 },
    ];

    filterByData(event) {
        // if (event == 1) {
        //     this.getGraphData(1);
        // } else {
        //     this.getGraphData(2);
        // }
    }


    exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        // console.log(this.transactionsData);
        let rows = []
        this.transactionsData.forEach((element, i) => {
            var temp = [i + 1, element.accountName, element.paymentMode == 0
                ? "Gpay"
                : element.paymentMode == 1
                    ? "PhonePe"
                    : element.paymentMode == 2
                        ? "Credit Card / Debit Card"
                        : element.paymentMode == 3
                            ? "Cheque"
                            : element.paymentMode == 4
                                ? "Cash"
                                : "-", this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.credit ? element.credit : '-', element.debit ? element.debit : '-', element.taxStatus == 1
                ? "Included"
                : element.taxStatus == 2
                    ? "Excluded"
                    : "-", element.taxRate ? element.taxRate + "%" : "-", element.taxAmount ? element.taxAmount : "-", element.description ? element.description : '-', element.runningBalance];
            rows.push(temp);
        });
        doc['autoTable'](this.exportColumns, rows);
        doc.save("Transactions.pdf");
    }

    exportExcel() {
        var rows = [];
        const date = new Date();
        this.transactionsData.forEach((element, i) => {
            var temp = [i + 1, element.accountName, element.paymentMode == 0
                ? "Gpay"
                : element.paymentMode == 1
                    ? "PhonePe"
                    : element.paymentMode == 2
                        ? "Credit Card / Debit Card"
                        : element.paymentMode == 3
                            ? "Cheque"
                            : element.paymentMode == 4
                                ? "Cash"
                                : "-", this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.credit ? element.credit : '-', element.debit ? element.debit : '-', element.taxStatus == 1
                ? "Included"
                : element.taxStatus == 2
                    ? "Excluded"
                    : "-", element.taxRate ? element.taxRate + "%" : "-", element.taxAmount ? element.taxAmount : "-", element.description ? element.description : '-', element.runningBalance];
            rows.push(temp);
        });
        TableUtil.exportArrayToExcel(rows, "Transactions " + this.datePipe.transform(date, 'dd-MMM-yyyy'));
    }

    getTransactions() {
        // console.log(this.getTransactionsModal);

        this._accountService
            .getTransactions(this.getTransactionsModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                // console.log(this._commonService.decryptData(res));
                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );
                this.transactionsData = this._commonService.decryptData(res)
                this.dataSource.paginator = this.paginator;
                this.changeDetection.detectChanges();
            });
    }

    dateFilter() {
        this.getTransactions();
    }

    clearDate() {
        (this.getTransactionsModal.startDate = null),
            (this.getTransactionsModal.endDate = null),
            this.getTransactions();
    }
}
