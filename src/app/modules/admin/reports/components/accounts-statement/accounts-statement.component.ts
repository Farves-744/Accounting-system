import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetAccountName } from 'app/shared/modals/reports';
import { ReportsService } from 'app/shared/services/reports.service';
import { AccountTransactionsComponent } from '../account-transactions/account-transactions.component';

@Component({
    selector: 'app-accounts-statement',
    templateUrl: './accounts-statement.component.html',
    styleUrls: ['./accounts-statement.component.scss'],
})
export class AccountsStatementComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getAccountNameModel: GetAccountName = new GetAccountName();

    textInputDisabled: boolean = true;
    showTrans: boolean = true;

    toggleTextInput() {
        this.textInputDisabled = !this.textInputDisabled;
    }

    constructor(
        private _commonService: CommonService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef
    ) {}

    displayedColumns: string[] = ['position', 'holderName', 'transactions'];

    ngOnInit(): void {
        this.getAccountNameModel.userId = this._commonService.getUserId();
        this.getAccountName();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    viewTransactions(id: any) {
        this.router.navigate(['/reports/account-transactions'], {
            state: { data: id },
        });
    }

    searchAccountName(event: any) {
        this.getAccountNameModel.search =
            event.target.value === '' ? null : event.target.value;
        this.getAccountName();
    }

    getAccountName() {
        console.log(this.getAccountNameModel);

        this._reportService
            .getAccountsName(this.getAccountNameModel)
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
        this.getAccountName();
    }

    clearDate() {
        (this.getAccountNameModel.startDate = null),
            (this.getAccountNameModel.endDate = null),
            this.getAccountName();
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
