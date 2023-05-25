import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ReceiptDialogComponent } from '../receipt-dialog/receipt-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetIncomeReports } from 'app/shared/modals/reports';
import { ReportsService } from 'app/shared/services/reports.service';
import { IncomeService } from 'app/shared/services/income.service';
import { getIncomeCategory } from 'app/shared/modals/income-category';
import { environment } from 'environments/environment';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'app-income-report',
    templateUrl: './income-report.component.html',
    styleUrls: ['./income-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class IncomeReportComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getIncomeReportsModal: GetIncomeReports = new GetIncomeReports();
    getCategoryNameModal: getIncomeCategory = new getIncomeCategory();
    categoryData: any;
    url = environment.BASE_URL;

    dashboardAccess: any

    constructor(
        private _commonService: CommonService,
        private _incomeService: IncomeService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private router: Router,
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
        console.log(this.getIncomeReportsModal);

        this._reportService
            .getIncomeReports(this.getIncomeReportsModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

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
            console.log(`Dialog result: ${result}`);
        });
    }

    openPaymentDialog(id: number) {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            width: '900px',
            data: { id },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    getCategoryName() {
        this._incomeService
            .getCategory(this.getCategoryNameModal)
            .subscribe((res) => {
                console.log(this._commonService.decryptData(res));
                this.categoryData = this._commonService.decryptData(res);
                console.log(this.categoryData);

                this.changeDetection.detectChanges();
            });
    }

    filterByCategory(id) {
        console.log(id);
        const req = {
            id: id,
            userId: this.getIncomeReportsModal.userId,
        };
        this._incomeService.filterByCategory(req).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.dataSource = new MatTableDataSource(
                this._commonService.decryptData(res)
            );

            this.dataSource.paginator = this.paginator;
        });
    }
}
