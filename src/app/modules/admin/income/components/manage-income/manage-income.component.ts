import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ReceiptDialogComponent } from '../receipt-dialog/receipt-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { CollectDialogComponent } from '../collect-dialog/collect-dialog.component';
import { IncomeService } from 'app/shared/services/income.service';
import { ReportsService } from 'app/shared/services/reports.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetIncomeReports } from 'app/shared/modals/reports';
import { getIncome } from 'app/shared/modals/income';
import { environment } from 'environments/environment';
import { getIncomeCategory } from 'app/shared/modals/income-category';
import { AppComponent } from 'app/app.component';

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import { TableUtil } from 'app/shared/tableUtil';


@Component({
    selector: 'app-manage-income',
    templateUrl: './manage-income.component.html',
    styleUrls: ['./manage-income.component.scss']
})
export class ManageIncomeComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getIncomeModal: getIncome = new getIncome();
    url = environment.BASE_URL;
    getCategoryNameModal: getIncomeCategory = new getIncomeCategory();
    categoryData: any;

    checkAdd: any;
    dashboardAccess: any
    checkEdit: any;

    cols: any[];
    exportColumns;
    incomeData: any

    constructor(
        private _commonService: CommonService,
        private _incomeService: IncomeService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private datePipe: DatePipe
    ) {
        this.checkAdd = (AppComponent.checkUrl("manageIncomesAdd"))
        this.checkEdit = (AppComponent.checkUrl("manageIncomesEdit"))
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


    ngOnInit(): void {
        this.getIncomeModal.userId = this._commonService.getUserId();
        this.getCategoryNameModal.userId = this._commonService.getUserId();
        this.getIncome();
        this.getCategoryIcon();

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

    navigateToHome() {
        this._commonService.navigateToHome();
    }


    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchIncome(event: any) {
        this.getIncomeModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getIncome();
    }

    addIncome() {
        this.router.navigateByUrl('/income/add-income');
    }

    editIncome(id: any) {
        this.router.navigate(['/income/add-income'], {
            state: { data: id },
        });
    }

    exportPdf() {
        const doc = new jsPDF('p', 'pt', 'a4');
        console.log(this.incomeData);
        let rows = []
        this.incomeData.forEach(element => {
            var temp = [element.id, element.categoryName, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.taxAmount ? element.taxAmount : '-', element.totalAmount];
            rows.push(temp);
        });
        doc['autoTable'](this.exportColumns, rows);
        doc.save("Incomes.pdf");
    }

    exportExcel() {
        var rows = [];
        const date = new Date();
        this.incomeData.forEach((element, i) => {
            var temp = [i + 1, element.categoryName, element.description ? element.description : '-', this.datePipe.transform(new Date(element.actualDate), 'dd-MM-yyyy'), element.taxAmount ? element.taxAmount : '-', element.totalAmount];
            rows.push(temp);
        });
        TableUtil.exportArrayToExcel(rows, "Incomes " + this.datePipe.transform(date, 'dd-MMM-yyyy'));
    }


    getIncome() {
        console.log(this.getIncomeModal);

        this._reportService
            .getIncomeReports(this.getIncomeModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

                this.incomeData = this._commonService.decryptData(res)

                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    getCategoryIcon() {
        this._incomeService
            .getCategory(this.getCategoryNameModal)
            .subscribe((res) => {
                console.log(this._commonService.decryptData(res));
                this.categoryData = this._commonService.decryptData(res);
                console.log(this.categoryData);

                this.changeDetection.detectChanges();
            });
    }

    dateFilter() {
        this.getIncome();
    }

    clearDate() {
        (this.getIncomeModal.startDate = null),
            (this.getIncomeModal.endDate = null),
            this.getIncome();
    }

    openReceiptDialog(imageUrl) {
        console.log(imageUrl);

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

    // addIncome() {
    //     this.router.navigateByUrl('/income/add-income');
    // }

    // openReceiptDialog() {
    //     const dialogRef = this.dialog.open(ReceiptDialogComponent, {
    //         width: '900px',
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log(`Dialog result: ${result}`);
    //     });
    // }

    // openPaymentDialog() {
    //     const dialogRef = this.dialog.open(PaymentDialogComponent, {
    //         width: '900px',
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log(`Dialog result: ${result}`);
    //     });
    // }
}
