import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    Input,
    ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { IncomeCategoriesDialogComponent } from '../income-categories-dialog/income-categories-dialog.component';
import { CommonService } from 'app/shared/services/common.service';
import { getIncomeCategory } from 'app/shared/modals/income-category';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
// import { DatePipe } from '@angular/common';
import { IncomeService } from 'app/shared/services/income.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-income-categories',
    templateUrl: './income-categories.component.html',
    styleUrls: ['./income-categories.component.scss'],
})
export class IncomeCategoriesComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getCategoryModal: getIncomeCategory = new getIncomeCategory();
    displayedColumns: string[] = ['position', 'categoryName', 'actions'];
    incomeResult: any;
    url = environment.BASE_URL;

    constructor(
        private router: Router,
        private _commonService: CommonService,
        public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        // private datePipe: DatePipe,
        private _incomeService: IncomeService
    ) {}

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
        const dialogRef = this.dialog.open(IncomeCategoriesDialogComponent, {
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
        this._incomeService
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
        const dialogRef = this.dialog.open(IncomeCategoriesDialogComponent, {
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

    // categoryId: number;
    // deleteCategory(content: any, id: any) {
    //     this.categoryId = id;
    //     const dialogRef = this.dialog.open(content);
    //     this.IncomeCategoriesDialogComponent.togglePopup = 'deleteCategory';
    // }
    // confirm() {}

    ngAfterViewInit() {}

    // onSuccessAdd(event) {
    //     if (event == 'added') {
    //         this.showAddDialog = false;
    //         this.getIncomeCategory();
    //     } else if (event == 'closed') {
    //         this.showAddDialog = false;
    //     }
    // }

    // getIncomeCategory() {
    //     this.commonService.getIncomeCategoryData(this.data).subscribe(
    //         (data) => {
    //             this.incomeCategory = this.commonService.decryptData(data);
    //             console.log(this.commonService.decryptData(data));
    //             this.changeDetection.detectChanges();
    //         },
    //         (e: HttpErrorResponse) => {
    //             console.log(e);
    //         }
    //     );
    // }

    // deleteIncomeCategory(id: number) {
    //     let req = {
    //         userId: this.incomeCategoryModal.userId,
    //         id: id,
    //     };
    //     this.showDeleteDialog = true;
    //     this.commonService.deleteIncomeCategoryData(req).subscribe((res) => {});
    // }
}
