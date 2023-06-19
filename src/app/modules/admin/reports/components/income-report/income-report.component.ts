import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'environments/environment';
import { ReceiptDialogComponent } from '../receipt-dialog/receipt-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { GetIncomeReports } from 'app/shared/modals/reports';
import { ReportsService } from 'app/shared/services/reports.service';
import { IncomeService } from 'app/shared/services/income.service';
import { getIncomeCategory } from 'app/shared/modals/income-category';
import { AppComponent } from 'app/app.component';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

@Component({
    selector: 'app-income-report',
    templateUrl: './income-report.component.html',
    styleUrls: ['./income-report.component.scss']


})
export class IncomeReportComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getIncomeReportsModal: GetIncomeReports = new GetIncomeReports();
    getCategoryNameModal: getIncomeCategory = new getIncomeCategory();
    categoryData: any;
    url = environment.BASE_URL;

    dashboardAccess: any

    cols: any[];
    exportColumns;
    incomeReportsData: any

    constructor(
        private _commonService: CommonService,
        private _incomeService: IncomeService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private router: Router,
        private datePipe: DatePipe,
        private changeDetection: ChangeDetectorRef
    ) {
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    displayedColumns: string[] = [
        'position',
        'categoryName',
        'description',
        'date',
        'taxAmount',
        'amount',
        'receipt',
        'details',
    ];

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    ngOnInit(): void {
        this.getIncomeReportsModal.userId = this._commonService.getUserId();
        this.getCategoryNameModal.userId = this._commonService.getUserId();
        this.getIncomeReports();
        this.getCategoryName();

        this.cols = [
            { field: "sn", header: "SN" },
            { field: "categoryName", header: "CATEGORY NAME" },
            { field: "description", header: "DESCRIPTION" },
            { field: "actualDate", header: "DATE" },
            { field: "taxAmount", header: "TAX AMOUNT" },
            { field: "totalAmount", header: "AMOUNT" },
        ];

        this.exportColumns = this.cols.map(col => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        // console.log(this.incomeReportsData);
        let rows = []
        this.incomeReportsData.forEach((element, i) => {
            var temp = [i + 1, element.categoryName, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.taxAmount ? element.taxAmount : '-', element.totalAmount];
            rows.push(temp);
        });
        doc['autoTable'](this.exportColumns, rows);
        doc.save("Income Reports.pdf");
    }

    exportExcel() {
        var rows = [];
        const date = new Date();
        this.incomeReportsData.forEach((element, i) => {
            var temp = [i + 1, element.categoryName, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.taxAmount ? element.taxAmount : '-', element.totalAmount];
            rows.push(temp);
        });
        TableUtil.exportArrayToExcel(rows, "Income Reports " + this.datePipe.transform(date, 'dd-MMM-yyyy'));
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchIncomeReport(event: any) {
        this.getIncomeReportsModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getIncomeReports();
    }

    getIncomeReports() {
        // console.log(this.getIncomeReportsModal);

        this._reportService
            .getIncomeReports(this.getIncomeReportsModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                // console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

                this.incomeReportsData = this._commonService.decryptData(res)

                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    dateFilter() {
        this.getIncomeReports();
    }

    clearDate() {
        (this.getIncomeReportsModal.startDate = null),
            (this.getIncomeReportsModal.endDate = null),
            this.getIncomeReports();
    }

    openReceiptDialog(imageUrl) {
        const dialogRef = this.dialog.open(ReceiptDialogComponent, {
            width: '900px',
            data: { imageUrl },
        });
        dialogRef.afterClosed().subscribe((result) => {
            // console.log(`Dialog result: ${result}`);
        });
    }

    openPaymentDialog(id: number) {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            width: '900px',
            data: { id },
        });
        dialogRef.afterClosed().subscribe((result) => {
            // console.log(`Dialog result: ${result}`);
        });
    }

    getCategoryName() {
        this._incomeService
            .getCategory(this.getCategoryNameModal)
            .subscribe((res) => {
                // console.log(this._commonService.decryptData(res));
                this.categoryData = this._commonService.decryptData(res);
                // console.log(this.categoryData);

                this.changeDetection.detectChanges();
            });
    }

    filterByCategory(id) {
        // console.log(id);
        const req = {
            id: id,
            userId: this.getIncomeReportsModal.userId,
        };
        this._incomeService.filterByCategory(req).subscribe((res) => {
            // console.log(this._commonService.decryptData(res));
            this.dataSource = new MatTableDataSource(
                this._commonService.decryptData(res)
            );

            this.dataSource.paginator = this.paginator;
        });
    }
}
