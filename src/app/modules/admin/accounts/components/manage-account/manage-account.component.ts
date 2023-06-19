import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { ShowDialogComponent } from '../show-dialog/show-dialog.component';
import { NewAccountComponent } from '../new-account/new-account.component';
import { AccountService } from 'app/shared/services/account.service';
import { GetAccounts } from 'app/shared/modals/accounts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppComponent } from 'app/app.component';
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component';

@Component({
    selector: 'app-manage-account',
    templateUrl: './manage-account.component.html',
    styleUrls: ['./manage-account.component.scss']


})
export class ManageAccountComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getAccountModal: GetAccounts = new GetAccounts();
    displayedColumns: string[] = ['position', 'accountName', 'actions'];

    // filter
    filterForm: any;
    pipe: DatePipe;

    checkAdd: any;
    dashboardAccess: any
    checkEdit: any;
    checkDelete: any;

    constructor(
        private _commonService: CommonService,
        private _accountService: AccountService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        public newAccount: NewAccountComponent,
        private _formBuilder: FormBuilder
    ) {
        this.checkAdd = (AppComponent.checkUrl("manageAccountsAdd"))
        this.checkEdit = (AppComponent.checkUrl("manageAccountsEdit"))
        this.checkDelete = (AppComponent.checkUrl("manageAccountsDelete"))
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    ngOnInit(): void {
        this.getAccountModal.userId = this._commonService.getUserId();
        this.getAccount();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    openDeleteDialog(id: number) {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '400px',
            data: { id },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getAccount();
            }
        });
    }

    searchAccount(event: any) {
        this.getAccountModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getAccount();
    }

    getAccount() {
        // console.log(this.getAccountModal);

        this._accountService
            .getAccount(this.getAccountModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                // console.log(this._commonService.decryptData(res));

                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );

                this.dataSource.paginator = this.paginator;
                // this.dataSource.sort = this.sort;
                this.changeDetection.detectChanges();
            });
    }

    addAccount() {
        this.router.navigateByUrl('/accounts/new-account');
    }

    editAccount(element: any) {
        // this.router.navigateByUrl('/accounts/new-account'),
        //     { state: { data: { fromPOS: 'fromPOS' } } };
        this.router.navigate(['/accounts/new-account'], {
            state: { data: element },
        });
    }

    openShowDialog(id: number) {
        const dialogRef = this.dialog.open(ShowDialogComponent, {
            width: '750px',
            data: { id },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log(`Dialog result: ${result}`);
        });
        this.changeDetection.detectChanges();
    }

    dateFilter() {
        this.getAccount();
    }

    clearDate() {
        (this.getAccountModal.startDate = null),
            (this.getAccountModal.endDate = null),
            this.getAccount();
    }

    // public setUpdateMode() {
    //     this.newAccount.isUpdate = true;
    //     this.router.navigateByUrl('/accounts/new-account');
    // }
}
