import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { GetTaxReports } from 'app/shared/modals/reports';
import { CommonService } from 'app/shared/services/common.service';
import { ReportsService } from 'app/shared/services/reports.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-tax-report',
    templateUrl: './tax-report.component.html',
    styleUrls: ['./tax-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class TaxReportComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getTaxReportsModal: GetTaxReports = new GetTaxReports();
    categoryData: any;
    url = environment.BASE_URL;

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
        this.getTaxReportsModal.userId = this._commonService.getUserId();

        this.getTaxReports();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    searchTaxReport(event: any) {
        this.getTaxReportsModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getTaxReports();
    }

    getTaxReports() {
        console.log(this.getTaxReportsModal);

        this._reportService
            .getTaxReports(this.getTaxReportsModal)
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
        this.getTaxReports();
    }

    clearDate() {
        (this.getTaxReportsModal.startDate = null),
            (this.getTaxReportsModal.endDate = null),
            this.getTaxReports();
    }
}
