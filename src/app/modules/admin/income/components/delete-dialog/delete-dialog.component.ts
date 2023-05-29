import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';
import { IncomeService } from 'app/shared/services/income.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],


})
export class DeleteDialogComponent implements OnInit {
    constructor(
        private _incomeService: IncomeService,
        private messageService: MessageService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    userId: any;

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
    }

    deleteCategory() {
        const req = {
            userId: this.userId,
            id: this.data.id,
        };

        this._incomeService.deleteCategory(req).subscribe(
            (res) => {
                console.log(this._commonService.decryptData(res));
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Income deleted successfully' });
            },
            (err) => {
                this.messageService.add({ severity: 'info', summary: 'You cannot delete', detail: 'This category is being used' });
            }
        );
        this._dialogRef.close(true);
    }
}
