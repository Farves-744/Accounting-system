import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonService } from 'app/shared/services/common.service';
import { TaxService } from 'app/shared/services/tax.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class DeleteDialogComponent implements OnInit {
    constructor(
        private _taxService: TaxService,
        private messageService: MessageService,
        private _commonService: CommonService,
        public _dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    userId: any;

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
    }

    deleteTax() {
        const req = {
            userId: this.userId,
            id: this.data.id,
        };

        this._taxService.deleteTax(req).subscribe(
            (res) => {
                console.log(this._commonService.decryptData(res));
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tax deleted successfully' });
            },
            (err) => {
                this.messageService.add({ severity: 'info', summary: 'You cannot delete', detail: 'This Tax is being used' });
            }
        );
        this._dialogRef.close(true);
    }
}
