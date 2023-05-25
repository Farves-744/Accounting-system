import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { UserService } from 'app/shared/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class DeleteDialogComponent implements OnInit {
    constructor(
        private _userService: UserService,
        private messageService: MessageService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

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
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
            },
            (err) => {
                console.log(err.status);

                if (err.status === 605) {
                    this.messageService.add({ severity: 'info', summary: 'You cannot delete', detail: 'This User is being used' });
                }
            }
        );
        this._dialogRef.close(true);
    }
}
