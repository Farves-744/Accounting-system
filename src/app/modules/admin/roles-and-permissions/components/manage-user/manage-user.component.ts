import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GetUser } from 'app/shared/modals/user';
import { UserService } from 'app/shared/services/user.service';

@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    getUserModal: GetUser = new GetUser();

    displayedColumns: string[] = [
        'position',
        'userName',
        'userEmail',
        'userRole',
        'date',
        'actions',
    ];

    constructor(
        private _commonService: CommonService,
        private _userService: UserService,
        public dialog: MatDialog,
        private router: Router,
        private changeDetection: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getUserModal.userId = this._commonService.getUserId();
        this.getUser();
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
                this.getUser();
            }
        });
    }

    searchAccount(event: any) {
        this.getUserModal.search =
            event.target.value === '' ? null : event.target.value;
        this.getUser();
    }

    getUser() {
        console.log(this.getUserModal);

        this._userService.getUser(this.getUserModal).subscribe((res) => {
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

    addUser() {
        this.router.navigateByUrl('/roles-and-permissions/new-user');
    }

    editUser(element: any) {
        this.router.navigate(['/roles-and-permissions/new-user'], {
            state: { data: element },
        });
    }

    dateFilter() {
        this.getUser();
    }

    clearDate() {
        (this.getUserModal.startDate = null),
            (this.getUserModal.endDate = null),
            this.getUser();
    }

    // openShowDialog() {
    //     const dialogRef = this.dialog.open(ShowDialogComponent, {
    //         width: '750px',
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         console.log(`Dialog result: ${result}`);
    //     });
    // }
}
