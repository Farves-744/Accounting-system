import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-role-dialog',
    templateUrl: './delete-role-dialog.component.html',
    styleUrls: ['./delete-role-dialog.component.scss'],
})
export class DeleteRoleDialogComponent implements OnInit {
    constructor(
        private _roleService: RoleService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    userId: any;

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
    }

    deleteRole() {
        const req = {
            userId: this.userId,
            id: this.data.id,
        };

        this._roleService.deleteRole(req).subscribe(
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
