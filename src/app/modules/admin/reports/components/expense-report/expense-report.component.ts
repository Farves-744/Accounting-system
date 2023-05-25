import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ExpenseReceiptDialogComponent } from '../expense-receipt-dialog/expense-receipt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpensePaymentDialogComponent } from '../expense-payment-dialog/expense-payment-dialog.component';
import { GetExpenseReports } from 'app/shared/modals/reports';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'app/shared/services/reports.service';
import { getExpenseCategory } from 'app/shared/modals/expense-category';
import { ExpenseService } from 'app/shared/services/expense.service';
import { environment } from 'environments/environment';
import { ToasterService } from 'app/shared/services/toaster.service';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'app-expense-report',
    templateUrl: './expense-report.component.html',
    styleUrls: ['./expense-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ExpenseReportComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getExpenseReportsModal: GetExpenseReports = new GetExpenseReports();
    getCategoryNameModal: getExpenseCategory = new getExpenseCategory();
    categoryData: any;
    url = environment.BASE_URL;
    dashboardAccess: any

    constructor(
        private _commonService: CommonService,
        private _reportService: ReportsService,
        private _expenseService: ExpenseService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private toaster: ToasterService
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

    showSuccessToaster() {
        this.toaster.show('warning', 'Well done!', 'This is a success alert');
    }

    ngOnInit(): void {
        this.getExpenseReportsModal.userId = this._commonService.getUserId();
        this.getCategoryNameModal.userId = this._commonService.getUserId();
        this.getExpenseReports();
        this.getCategoryName();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchExpenseReport(event: any) {
        this.getExpenseReportsModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getExpenseReports();
    }

    getExpenseReports() {
        console.log(this.getExpenseReportsModal);

        this._reportService
            .getIncomeReports(this.getExpenseReportsModal)
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
        this.getExpenseReports();
    }

    clearDate() {
        (this.getExpenseReportsModal.startDate = null),
            (this.getExpenseReportsModal.endDate = null),
            this.getExpenseReports();
    }

    openReceiptDialog(imageUrl) {
        const dialogRef = this.dialog.open(ExpenseReceiptDialogComponent, {
            width: '900px',
            data: { imageUrl },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    openPaymentDialog(id: number) {
        const dialogRef = this.dialog.open(ExpensePaymentDialogComponent, {
            width: '900px',
            data: { id },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    getCategoryName() {
        this._expenseService
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
            userId: this.getExpenseReportsModal.userId,
        };
        this._expenseService.filterByCategory(req).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.dataSource = new MatTableDataSource(
                this._commonService.decryptData(res)
            );

            this.dataSource.paginator = this.paginator;
        });
    }
}
