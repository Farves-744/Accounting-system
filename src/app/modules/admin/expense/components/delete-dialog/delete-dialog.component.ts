import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { ExpenseService } from 'app/shared/services/expense.service';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
    constructor(
        private _expenseService: ExpenseService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {}

    userId: any;

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
    }

    deleteCategory() {
        const req = {
            userId: this.userId,
            id: this.data.id,
        };

        this._expenseService.deleteCategory(req).subscribe(
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
