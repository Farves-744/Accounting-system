import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetAccounts } from 'app/shared/modals/accounts';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';
import { ExpenseService } from 'app/shared/services/expense.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-collect-dialog',
    templateUrl: './collect-dialog.component.html',
    styleUrls: ['./collect-dialog.component.scss']

})
export class CollectDialogComponent implements OnInit {
    getAccountsModel: any = { userId: null, }
    isEdit: boolean = false;
    paymentsModal = [{ paymentMode: null, amount: null, accountId: null }];
    userId: any;
    fileToUpload: any;
    formData: any;
    imageId: any;
    any: any;
    accounts: any;
    accountsDetails: any;
    disableButton: boolean = false

    constructor(
        public dialogRef: MatDialogRef<CollectDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        private _formBuilder: FormBuilder,
        private _commonService: CommonService,
        private _accountService: AccountService,
        private _expenseService: ExpenseService,
        private changeDetection: ChangeDetectorRef,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        // console.log(this.data);
        this.userId = this._commonService.getUserId();
        this.getAccountsModel.userId = this._commonService.getUserId();
        // console.log(this.userId);
        setTimeout(() => {
            this.getAccountName();
        });
    }

    async formatImage(file: any) {
        // console.log(file);
        this.fileToUpload = file;
        this.formData = new FormData();
        this.formData.append('image', this.fileToUpload);
    }

    //! Validate if the total amount exceeds
    validateAmount() {
        let totalAmount = 0
        totalAmount = this.paymentsModal.map(item => item.amount).reduce((prev, curr) => prev + curr, 0);
        if (totalAmount >= this.data.totalAmount) {
            return true
        } else {
            return false
        }
    }

    validate() {
        this.validateAmount()
        this.validateBalance()
    }

    validateBalance() {
        const req = {
            userId: this.userId,
            id: null,
        }
        this.paymentsModal.forEach(item => {
            let accountDetails
            req.id = item.accountId

            this._accountService.getAccountById(req).subscribe(res => {
                // console.log(this._commonService.decryptData(res));
                const accountsDetails = this._commonService.decryptData(res)
                // console.log(accountsDetails);

                // this.accountsDetails = this._commonService.decryptData(res)
                // console.log(accountDetails);
                this.changeDetection.detectChanges();
                if (item.amount > accountsDetails.runningBalance) {
                    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Account Balance limit reached' });
                    this.disableButton = true;
                } else {
                    this.disableButton = false;
                }

                // for (let account of accountsDetails) {
                //     if (item.amount > account.runningBalance) {
                //         this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Account Balance limit reached' });
                //         this.disableButton = true;
                //     }
                // }
                // console.log(accountsDetails);
            })
        })
    }

    addOrEditPayment() {
        if (history.state.data) {
            this.data.userId = this.userId;
            this.data.payments = this.paymentsModal;
            // console.log(this.data);
            // console.log(this.data.file);
            this.formatImage(this.data.file);
            this.data.userId = this.userId;

            // console.log(this.data);
            // console.log(this.formData);
            if (this.data.file != undefined) {
                this._expenseService
                    .addCategoryImage(this.formData)
                    .subscribe((res) => {
                        // console.log(res);
                        let reData = JSON.parse(JSON.stringify(res));
                        this.imageId = reData.imageId;
                        this.data.deleteImageId = this.data.imageId;
                        this.data.imageId = this.imageId;
                        // console.log(this.data.imageId);
                        // console.log(this.data.deleteImageId);
                        this.updateExpense();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense updated successfully' });
                        // console.log(this.data.imageId);
                        // console.log(this.data);
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
            } else {
                // console.log(this.data);
                this.updateExpense();

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense updated successfully' });
            }
        } else {
            this.data.userId = this.userId;
            this.data.payments = this.paymentsModal;
            // console.log(this.data.file);
            // console.log(this.data);

            if (this.data.file != null) {

                this.formatImage(this.data.file);
                this._expenseService
                    .addCategoryImage(this.formData)
                    .subscribe((res) => {
                        // console.log(res);
                        let reData = JSON.parse(JSON.stringify(res));
                        this.imageId = reData.imageId;
                        this.data.imageId = this.imageId;
                        this.addExpense();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully' });
                        // console.log(this.data.imageId);
                        // console.log(this.data);
                    });
            } else {
                this.addExpense();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense added successfully' });
            }
        }
    }


    addExpense() {
        this._expenseService.addExpense(this.data).subscribe((res) => {
            // console.log(this._commonService.decryptData(res));
            this.dialogRef.close(true);
            this.changeDetection.detectChanges();
        }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
        });
    }

    updateExpense() {
        this._expenseService.updateExpense(this.data).subscribe((res) => {
            // console.log(this._commonService.decryptData(res));
            this.dialogRef.close(true);
            this.changeDetection.detectChanges();
        }, (error) => {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
        });
    }

    addForm() {
        // console.log(this.data);

        this.paymentsModal.push({
            paymentMode: null,
            amount: null,
            accountId: null,
        });

        // console.log(this.paymentsModal);
        // console.log(this.data);
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
            // console.log(history.state.data);
            // console.log(this.data);
            this.paymentsModal = this.data.payments;
            // console.log(this.paymentsModal);
        }
    }

    getAccountName() {
        // console.log(this.getAccountsModel);


        this._accountService
            .getAccountsByUserId(this.getAccountsModel)
            .subscribe((res) => {
                // console.log(this._commonService.decryptData(res));
                this.accounts = this._commonService.decryptData(res);
                // console.log(this.accounts);
                this.changeDetection.detectChanges();
            }, (error) => {
                // console.log(error);
            });
    }
}

