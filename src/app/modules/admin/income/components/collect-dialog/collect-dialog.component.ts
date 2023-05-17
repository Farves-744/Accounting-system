import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { PaymentModel } from 'app/shared/modals/income';
import { AccountService } from 'app/shared/services/account.service';
import { GetAccounts } from 'app/shared/modals/accounts';
import { CommonService } from 'app/shared/services/common.service';
import { IncomeService } from 'app/shared/services/income.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
    selector: 'app-collect-dialog',
    templateUrl: './collect-dialog.component.html',
    styleUrls: ['./collect-dialog.component.scss'],
})
export class CollectDialogComponent implements OnInit {
    getAccountsModel: GetAccounts = new GetAccounts();
    isEdit: boolean = false;
    paymentsModal = [{ paymentMode: null, amount: null, accountId: null }];
    userId: any;
    fileToUpload: any;
    formData: any;
    imageId;
    any;
    accounts: any;

    constructor(
        public dialogRef: MatDialogRef<CollectDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private _formBuilder: FormBuilder,
        private _commonService: CommonService,
        private _accountService: AccountService,
        private _incomeService: IncomeService,
        private changeDetection: ChangeDetectorRef,
        private toaster: ToasterService
    ) { }

    ngOnInit(): void {
        console.log(this.data);
        this.userId = this._commonService.getUserId();
        console.log(this.userId);
        setTimeout(() => {
            this.getAccountName();
        });
        this.editPayment(this.data);
    }

    async formatImage(file: any) {
        console.log(file);
        this.fileToUpload = file;
        this.formData = new FormData();
        this.formData.append('image', this.fileToUpload);
    }

    addOrEditPayment() {
        if (history.state.data) {
            this.data.userId = this.userId;
            this.data.payments = this.paymentsModal;
            console.log(this.data);
            console.log(this.data.file);
            this.formatImage(this.data.file);
            this.data.userId = this.userId;

            console.log(this.data);
            console.log(this.formData);
            if (this.data.file != undefined) {
                this._incomeService
                    .addCategoryImage(this.formData)
                    .subscribe((res) => {
                        console.log(res);
                        let reData = JSON.parse(JSON.stringify(res));
                        this.imageId = reData.imageId;
                        this.data.deleteImageId = this.data.imageId;
                        this.data.imageId = this.imageId;
                        console.log(this.data.imageId);
                        console.log(this.data.deleteImageId);
                        this.updateIncome();
                        // this.toaster.show('success', 'Income  successfully');

                        console.log(this.data.imageId);
                        console.log(this.data);
                    });
            } else {
                console.log(this.data);
                this.updateIncome();
                // this.toaster.show('success', 'Income updated successfully');
            }
        } else {
            this.data.userId = this.userId;
            this.data.payments = this.paymentsModal;
            console.log(this.data);

            console.log(this.data.file);

            if (this.data.file != null) {
                this.formatImage(this.data.file);
                this._incomeService.addCategoryImage(this.formData).subscribe(
                    (res) => {
                        console.log(res);
                        let reData = JSON.parse(JSON.stringify(res));
                        this.imageId = reData.imageId;
                        this.data.imageId = this.imageId;
                        this.addIncome();
                        this.toaster.show(
                            'success',
                            'Income added successfully'
                        );
                        console.log(this.data.imageId);
                        console.log(this.data);
                    },
                    (error) => {
                        this.toaster.show('error', 'Something went wrong');
                    }
                );
            } else {
                this.addIncome();
            }
        }
    }

    editPayment(data: any) {
        if (data) {
            console.log(data);
            // this.updateFormData = data;
            // this.isEdit = true;
            // this.addCategoryForm.patchValue(this.updateFormData);
            // console.log(this.addCategoryForm.value.image_url);
            // this.imageUrl = this.env.BASE_URL + '/' + data.image_url;
            // console.log(this.updateFormData);
            // console.log(this.url);
        }
    }


    addIncome() {
        this._incomeService.addIncome(this.data).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.dialogRef.close(true);
            this.changeDetection.detectChanges();
        });
    }

    updateIncome() {
        this._incomeService.updateIncome(this.data).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.dialogRef.close(true);
            this.changeDetection.detectChanges();
        });
    }

    addForm() {
        console.log(this.data);

        this.paymentsModal.push({
            paymentMode: null,
            amount: null,
            accountId: null,
        });

        console.log(this.paymentsModal);
        console.log(this.data);
    }

    paymentMode = [
        { name: 'Gpay', id: 0 },
        { name: 'Phone Pe', id: 1 },
        { name: 'Credit Card/Debit Card', id: 2 },
        { name: 'Cheque', id: 3 },
        { name: 'Cash', id: 4 },
    ];

    removeForm(index: number) {
        if (this.paymentsModal.length > 1) {
            this.paymentsModal.splice(index, 1);
        }
    }

    ngAfterContentInit() {
        if (history.state.data) {
            this.isEdit = true;
            console.log(history.state.data);
            console.log(this.data);
            this.paymentsModal = this.data.payments;
            console.log(this.paymentsModal);
        }
    }

    getAccountName() {
        console.log(this.getAccountsModel);

        this.getAccountsModel.userId = this.userId;

        this._accountService
            .getAccount(this.getAccountsModel)
            .subscribe((res) => {
                console.log(this._commonService.decryptData(res));
                this.accounts = this._commonService.decryptData(res);
                console.log(this.accounts);
                this.changeDetection.detectChanges();
            });
    }
}
