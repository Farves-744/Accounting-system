import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { GetTransactions } from 'app/shared/modals/accounts';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class TransactionsComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getTransactionsModal: GetTransactions = new GetTransactions();
    // categoryData: any;
    url = environment.BASE_URL;

    dashboardAccess: any

    constructor(
        private _commonService: CommonService,
        private _accountService: AccountService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef
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
        this.getTransactionsModal.userId = this._commonService.getUserId();

        this.getTransactions();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchTransactions(event: any) {
        this.getTransactionsModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getTransactions();
    }

    filterBy = [
        { name: 'Included', id: 1 },
        { name: 'Excluded', id: 2 },
    ];

    filterByData(event) {
        // if (event == 1) {
        //     this.getGraphData(1);
        // } else {
        //     this.getGraphData(2);
        // }
    }

    getTransactions() {
        console.log(this.getTransactionsModal);

        this._accountService
            .getTransactions(this.getTransactionsModal)
            .subscribe((res) => {
                // const decryptedData = this._commonService.decryptData(res);
                console.log(this._commonService.decryptData(res));
                this.dataSource = new MatTableDataSource(
                    this._commonService.decryptData(res)
                );
                this.dataSource.paginator = this.paginator;
                this.changeDetection.detectChanges();
            });
    }

    dateFilter() {
        this.getTransactions();
    }

    clearDate() {
        (this.getTransactionsModal.startDate = null),
            (this.getTransactionsModal.endDate = null),
            this.getTransactions();
    }
}
