import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetAccountStatement } from 'app/shared/modals/reports';
import { ReportsService } from 'app/shared/services/reports.service';
import { AppComponent } from 'app/app.component';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

@Component({
    selector: 'app-account-transactions',
    templateUrl: './account-transactions.component.html',
    styleUrls: ['./account-transactions.component.scss']


})
export class AccountTransactionsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getAccountStatementModel: GetAccountStatement = new GetAccountStatement();

    dashboardAccess: any

    cols: any[];
    exportColumns;
    accountTransactionsData: any

    constructor(
        private _commonService: CommonService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private router: Router,
        private changeDetection: ChangeDetectorRef
    ) {
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    displayedColumns: string[] = [
        'position',
        'description',
        'paymentMode',
        'date',
        'creditAmount',
        'debitAmount',
        'runningBalance',
    ];

    ngOnInit(): void {
        this.getAccountStatementModel.userId = this._commonService.getUserId();
        this.getAccountStatement();
        // console.log(history.state.data);

        this.cols = [
            { field: "sn", header: "SN" },
            { field: "description", header: "DESCRIPTION" },
            { field: "paymentMode", header: "PAYMENT MODE" },
            { field: "actualDate", header: "DATE" },
            { field: "credit", header: "CREDIT AMOUNT" },
            { field: "debit", header: "DEBIT AMOUNT" },
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

    searchExpenseReport(event: any) {
        this.getAccountStatementModel.search =
            event.target.value === '' ? null : event.target.value;
        this.getAccountStatement();
    }

    getAccountStatement() {
        this.getAccountStatementModel.id = history.state.data;
        // console.log(this.getAccountStatementModel);

        this._reportService
            .getAccountStatements(this.getAccountStatementModel)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                // console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

                this.accountTransactionsData = this._commonService.decryptData(res)

                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    dateFilter() {
        this.getAccountStatement();
    }

    exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        // console.log(this.accountTransactionsData);
        let rows = []

        this.accountTransactionsData.forEach((element, i) => {
            var temp = [i + 1, element.description ? element.description : '-', element.payment_mode == 0
                ? "Gpay"
                : element.payment_mode == 1
                    ? "PhonePe"
                    : element.payment_mode == 2
                        ? "Credit Card / Debit Card"
                        : element.payment_mode == 3
                            ? "Cheque"
                            : element.payment_mode == 4
                                ? "Cash"
                                : "-", this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.credit ? element.credit : '-', element.debit ? element.debit : '-', element.running_balance];
            rows.push(temp);
        });
        doc['autoTable'](this.exportColumns, rows);
        doc.save("Accounts Transactions.pdf");
    }

    exportExcel() {
        var rows = [];
        const date = new Date();
        this.accountTransactionsData.forEach((element, i) => {
            var temp = [i + 1, element.description ? element.description : '-', element.payment_mode == 0
                ? "Gpay"
                : element.payment_mode == 1
                    ? "PhonePe"
                    : element.payment_mode == 2
                        ? "Credit Card / Debit Card"
                        : element.payment_mode == 3
                            ? "Cheque"
                            : element.payment_mode == 4
                                ? "Cash"
                                : "-", this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.credit ? element.credit : '-', element.debit ? element.debit : '-', element.running_balance];
            rows.push(temp);
        });
        TableUtil.exportArrayToExcel(rows, "Transactions " + this.datePipe.transform(date, 'dd-MMM-yyyy'));
    }

    clearDate() {
        (this.getAccountStatementModel.startDate = null),
            (this.getAccountStatementModel.endDate = null),
            this.getAccountStatement();
    }

    goToAccStatement() {
        this.router.navigateByUrl('reports/accounts-statement');
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
