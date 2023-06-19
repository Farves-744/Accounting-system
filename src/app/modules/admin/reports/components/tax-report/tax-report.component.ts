import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { GetTaxReports } from 'app/shared/modals/reports';
import { CommonService } from 'app/shared/services/common.service';
import { ReportsService } from 'app/shared/services/reports.service';
import { environment } from 'environments/environment';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

@Component({
    selector: 'app-tax-report',
    templateUrl: './tax-report.component.html',
    styleUrls: ['./tax-report.component.scss']


})
export class TaxReportComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getTaxReportsModal: GetTaxReports = new GetTaxReports();
    categoryData: any;
    url = environment.BASE_URL;

    dashboardAccess: any

    cols: any[];
    exportColumns;
    taxReportsData: any

    constructor(
        private _commonService: CommonService,
        private _reportService: ReportsService,
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
        this.getTaxReportsModal.userId = this._commonService.getUserId();

        this.getTaxReports();

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

    searchTaxReport(event: any) {
        this.getTaxReportsModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getTaxReports();
    }

    getTaxReports() {
        // console.log(this.getTaxReportsModal);

        this._reportService
            .getTaxReports(this.getTaxReportsModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                // console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

                this.taxReportsData = this._commonService.decryptData(res)

                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        // console.log(this.taxReportsData);
        let rows = []
        this.taxReportsData.forEach((element, i) => {
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
        this.taxReportsData.forEach((element, i) => {
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

    dateFilter() {
        this.getTaxReports();
    }

    clearDate() {
        (this.getTaxReportsModal.startDate = null),
            (this.getTaxReportsModal.endDate = null),
            this.getTaxReports();
    }
}
