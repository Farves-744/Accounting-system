import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { UserService } from 'app/shared/services/user.service';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
    constructor(
        private _userService: UserService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    userId: any;

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
    }

    deleteUser() {
        const req = {
            userId: this.userId,
            id: this.data.id,
        };

        this._userService.deleteUser(req).subscribe(
            (res) => {
                console.log(this._commonService.decryptData(res));
            },
            (err) => {
                console.error;
            }
        );
        this._dialogRef.close(true);
    }
}
