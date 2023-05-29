import {
    Component,
    OnInit,
    Inject,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { AccountService } from 'app/shared/services/account.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common.service';

@Component({
    selector: 'app-show-dialog',
    templateUrl: './show-dialog.component.html',
    styleUrls: ['./show-dialog.component.scss']

})
export class ShowDialogComponent {
    userId: any;
    response: any;

    constructor(
        private _accountService: AccountService,
        private _commonService: CommonService,
        private changeDetection: ChangeDetectorRef,
        public _dialogRef: MatDialogRef<ShowDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit(): void {
        this.userId = parseInt(localStorage.getItem('userId'));

        setTimeout(() => {
            this.getAccountById();
        });
    }

    getAccountById() {
        const req = {
            userId: this.userId,
            id: this.data.id,
        };
        this._accountService.getAccountById(req).subscribe((res) => {
            this.response = this._commonService.decryptData(res)[0];
            console.log(this.response);
            this.changeDetection.detectChanges();
        });
    }
}
