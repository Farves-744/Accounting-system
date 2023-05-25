import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetAccountStatement } from 'app/shared/modals/reports';
import { ReportsService } from 'app/shared/services/reports.service';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'app-account-transactions',
    templateUrl: './account-transactions.component.html',
    styleUrls: ['./account-transactions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class AccountTransactionsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getAccountStatementModel: GetAccountStatement = new GetAccountStatement();

    dashboardAccess: any

    constructor(
        private _commonService: CommonService,
        private _reportService: ReportsService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef
    ) {
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    displayedColumns: string[] = [
        'position',
        'description',
        'paymentMode',
        'date',
        'creditAmount',
        'debitAmount',
        'runningBalance',
    ];

    ngOnInit(): void {
        this.getAccountStatementModel.userId = this._commonService.getUserId();
        this.getAccountStatement();
        console.log(history.state.data);
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchExpenseReport(event: any) {
        this.getAccountStatementModel.search =
            event.target.value === '' ? null : event.target.value;
        this.getAccountStatement();
    }

    getAccountStatement() {
        this.getAccountStatementModel.id = history.state.data;
        console.log(this.getAccountStatementModel);

        this._reportService
            .getAccountStatements(this.getAccountStatementModel)
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
        this.getAccountStatement();
    }

    clearDate() {
        (this.getAccountStatementModel.startDate = null),
            (this.getAccountStatementModel.endDate = null),
            this.getAccountStatement();
    }

    goToAccStatement() {
        this.router.navigateByUrl('reports/accounts-statement');
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
