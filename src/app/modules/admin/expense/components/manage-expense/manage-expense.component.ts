import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ReceiptDialogComponent } from '../receipt-dialog/receipt-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getExpense } from 'app/shared/modals/expense';
import { environment } from 'environments/environment';
import { getExpenseCategory } from 'app/shared/modals/expense-category';
import { ExpenseService } from 'app/shared/services/expense.service';
import { ReportsService } from 'app/shared/services/reports.service';
import { AppComponent } from 'app/app.component';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

@Component({
    selector: 'app-manage-expense',
    templateUrl: './manage-expense.component.html',
    styleUrls: ['./manage-expense.component.scss']
})
export class ManageExpenseComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getExpenseModal: getExpense = new getExpense();
    url = environment.BASE_URL;
    getCategoryNameModal: getExpenseCategory = new getExpenseCategory();
    categoryData: any;

    checkAdd: any;
    checkEdit: any;
    dashboardAccess: any

    cols: any[];
    exportColumns;
    expenseData: any
    urlList: any = []

    constructor(
        private _commonService: CommonService,
        private _expenseService: ExpenseService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {
        this.checkAdd = (AppComponent.checkUrl("manageExpensesAdd"))
        this.checkEdit = (AppComponent.checkUrl("manageExpensesEdit"))
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
        'actions',
    ];

    checkUrl(option) {
        for (let roleOption of this.urlList)
            if (option == roleOption)
                return true
        return false;
    }

    ngOnInit(): void {
        this.getExpenseModal.userId = this._commonService.getUserId();
        this.getCategoryNameModal.userId = this._commonService.getUserId();
        this.getExpense();
        this.getCategoryIcon();
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchExpense(event: any) {
        this.getExpenseModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getExpense();
    }

    addExpense() {
        // this.newAccount.isUpdate = false;
        this.router.navigateByUrl('/expense/add-expense');
    }

    editExpense(id: any) {
        this.router.navigate(['/expense/add-expense'], {
            state: { data: id },
        });
        // console.log(id);

    }

    exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        // console.log(this.expenseData);
        let rows = []
        this.expenseData.forEach(element => {
            var temp = [element.id, element.categoryName, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.taxAmount ? element.taxAmount : '-', element.totalAmount];
            rows.push(temp);
        });
        doc['autoTable'](this.exportColumns, rows);
        doc.save("Expenses.pdf");
    }

    exportExcel() {
        var rows = [];
        const date = new Date();
        this.expenseData.forEach((element, i) => {
            var temp = [i + 1, element.categoryName, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.taxAmount ? element.taxAmount : '-', element.totalAmount];
            rows.push(temp);
        });
        TableUtil.exportArrayToExcel(rows, "Expenses " + this.datePipe.transform(date, 'dd-MMM-yyyy'));
    }

    getExpense() {
        // console.log(this.getExpenseModal);

        this._reportService
            .getIncomeReports(this.getExpenseModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                // console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

                this.expenseData = this._commonService.decryptData(res)

                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    getCategoryIcon() {
        this._expenseService
            .getCategory(this.getCategoryNameModal)
            .subscribe((res) => {
                // console.log(this._commonService.decryptData(res));
                this.categoryData = this._commonService.decryptData(res);
                // console.log(this.categoryData);

                this.changeDetection.detectChanges();
            });
    }

    dateFilter() {
        this.getExpense();
    }

    clearDate() {
        (this.getExpenseModal.startDate = null),
            (this.getExpenseModal.endDate = null),
            this.getExpense();
    }

    openReceiptDialog(imageUrl) {
        // console.log(imageUrl);

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
}
