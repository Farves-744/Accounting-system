import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { DeleteRoleDialogComponent } from '../delete-role-dialog/delete-role-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { RoleService } from 'app/shared/services/role.service';
import { GetRole } from 'app/shared/modals/role';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'app-manage-roles',
    templateUrl: './manage-roles.component.html',
    styleUrls: ['./manage-roles.component.scss']


})
export class ManageRolesComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getRoleModal: GetRole = new GetRole();

    checkAdd: any;
    dashboardAccess: any
    checkEdit: any;
    checkDelete: any;

    constructor(
        private _commonService: CommonService,
        public dialog: MatDialog,
        private router: Router,
        private _roleService: RoleService,
        private changeDetection: ChangeDetectorRef
    ) {
        this.checkAdd = (AppComponent.checkUrl("manageRolesAdd"))
        this.checkEdit = (AppComponent.checkUrl("manageRolesEdit"))
        this.checkDelete = (AppComponent.checkUrl("manageRolesDelete"))
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    displayedColumns: string[] = [
        'position',
        'roleName',
        'createdAt',
        'updatedAt',
        'actions',
    ];

    ngOnInit(): void {
        this.getRoleModal.userId = this._commonService.getUserId();
        this.getRole();
    }

    applyFilter() {
        this.dataSource.filter = '' + Math.random();
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    openDeleteDialog(id: number) {
        const dialogRef = this.dialog.open(DeleteRoleDialogComponent, {
            width: '400px',
            data: { id },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getRole();
            }
        });
    }

    searchRole(event: any) {
        this.getRoleModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getRole();
    }

    getRole() {
        console.log(this.getRoleModal);

        this._roleService.getRole(this.getRoleModal).subscribe((res) => {
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

    addRole() {
        this.router.navigateByUrl('/roles-and-permissions/add-role');
    }

    editRole(element: any) {
        this.router.navigate(['/roles-and-permissions/add-role'], {
            state: { data: element },
        });
    }

    dateFilter() {
        this.getRole();
    }

    clearDate() {
        (this.getRoleModal.startDate = null),
            (this.getRoleModal.endDate = null),
            this.getRole();
    }
}
