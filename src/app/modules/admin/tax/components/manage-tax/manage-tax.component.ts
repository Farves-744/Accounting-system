import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NewAccountComponent } from 'app/modules/admin/accounts/components/new-account/new-account.component';
import { CommonService } from 'app/shared/services/common.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TaxService } from 'app/shared/services/tax.service';
import { MatTableDataSource } from '@angular/material/table';
import { GetTax } from 'app/shared/modals/tax';
import { MatPaginator } from '@angular/material/paginator';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'app-manage-tax',
    templateUrl: './manage-tax.component.html',
    styleUrls: ['./manage-tax.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ManageTaxComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getTaxModal: GetTax = new GetTax();
    displayedColumns: string[] = [
        'position',
        'taxName',
        'createdAt',
        'taxRate',
        'actions',
    ];

    checkAdd: any;
    dashboardAccess: any
    checkEdit: any;
    checkDelete: any;

    constructor(
        private _commonService: CommonService,
        private _taxService: TaxService,
        public dialog: MatDialog,
        private router: Router,
        public newAccount: NewAccountComponent,
        private changeDetection: ChangeDetectorRef
    ) {
        this.checkAdd = (AppComponent.checkUrl("manageTaxAdd"))
        this.checkEdit = (AppComponent.checkUrl("manageTaxEdit"))
        this.checkDelete = (AppComponent.checkUrl("manageTaxDelete"))
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    ngOnInit(): void {
        this.getTaxModal.userId = this._commonService.getUserId();
        this.getTax();
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
                this.getTax();
            }
        });
    }

    searchTax(event: any) {
        this.getTaxModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getTax();
    }

    getTax() {
        console.log(this.getTaxModal);

        this._taxService.getTax(this.getTaxModal).subscribe((res) => {
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

    addTax() {
        this.router.navigateByUrl('/tax/add-tax');
    }

    editTax(element: any) {
        this.router.navigate(['/tax/add-tax'], {
            state: { data: element },
        });
    }

    dateFilter() {
        this.getTax();
    }

    clearDate() {
        (this.getTaxModal.startDate = null),
            (this.getTaxModal.endDate = null),
            this.getTax();
    }

    // public setUpdateMode() {
    //     this.newAccount.isUpdate = true;
    //     this.router.navigateByUrl('/accounts/new-account');
    // }
}
