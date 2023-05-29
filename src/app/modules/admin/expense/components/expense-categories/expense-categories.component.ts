import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    Input,
    ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseCategoriesDialogComponent } from '../expense-categories-dialog/expense-categories-dialog.component';
import { CommonService } from 'app/shared/services/common.service';
import { getExpenseCategory } from 'app/shared/modals/expense-category';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
// import { DatePipe } from '@angular/common';
import { ExpenseService } from 'app/shared/services/expense.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'environments/environment';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'app-expense-categories',
    templateUrl: './expense-categories.component.html',
    styleUrls: ['./expense-categories.component.scss']


})
export class ExpenseCategoriesComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getCategoryModal: getExpenseCategory = new getExpenseCategory();
    displayedColumns: string[] = ['position', 'categoryName', 'actions'];
    incomeResult: any;
    url = environment.BASE_URL;

    dashboardAccess: any
    checkAdd: any;
    checkEdit: any;
    checkDelete: any;

    constructor(
        private router: Router,
        private _commonService: CommonService,
        public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        // private datePipe: DatePipe,
        private _expenseService: ExpenseService
    ) {

        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
        this.checkAdd = (AppComponent.checkUrl("expenseCategoriesAdd"))
        this.checkEdit = (AppComponent.checkUrl("expenseCategoriesEdit"))
        this.checkDelete = (AppComponent.checkUrl("expenseCategoriesDelete"))
    }

    ngOnInit(): void {
        this.getCategoryModal.userId = this._commonService.getUserId();
        this.getCategory();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    addCategory() {
        const dialogRef = this.dialog.open(ExpenseCategoriesDialogComponent, {
            width: '400px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getCategory();
            }
        });
    }

    openDeleteDialog(id: number) {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '400px',
            data: { id },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getCategory();
            }
        });
    }

    searchAccount(event: any) {
        this.getCategoryModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getCategory();
    }

    getCategory() {
        console.log(this.getCategoryModal);
        this._expenseService
            .getCategory(this.getCategoryModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                console.log(
                    JSON.parse(
                        JSON.stringify(this._commonService.decryptData(res))
                    )
                );
                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );
                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    editCategory(element: any) {
        const dialogRef = this.dialog.open(ExpenseCategoriesDialogComponent, {
            width: '400px',
            data: element,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getCategory();
            }
        });
    }

    clearDate() {
        (this.getCategoryModal.startDate = null),
            (this.getCategoryModal.endDate = null),
            this.getCategory();
    }

    dateFilter() {
        this.getCategory();
    }
}
