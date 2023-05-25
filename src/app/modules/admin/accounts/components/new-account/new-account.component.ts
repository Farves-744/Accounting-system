import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-new-account',
    templateUrl: './new-account.component.html',
    styleUrls: ['./new-account.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewAccountComponent {
    addAccountForm: FormGroup;
    updateFormData: any = undefined;
    userId: any;
    isEdit: boolean = false; // this is for toggle button text add or edit
    response: any;

    isAccessToManageAccounts: any;
    dashboardAccess: any

    // addAccountModal: AddAccount = new AddAccount();

    constructor(
        private _commonService: CommonService,
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private changeDetection: ChangeDetectorRef,
        private messageService: MessageService
    ) {
        this.isAccessToManageAccounts = (AppComponent.checkUrl("manageAccounts"))
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }
    accountType = [
        { type: 'Cash', id: 0 },
        { type: 'Savings Account', id: 1 },
        { type: 'Current Account', id: 2 },
    ];



    validateAccountNumber(event) {
        const req = {
            userId: this.userId,
            accountNo: event.target.value,
        };
        this._accountService.accountNumberValidate(req).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.response = this._commonService.decryptData(res);
            if (this.response.status === 'failure') {
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'This account number is already exist.' });
                event.target.value = '';
            }
            this.changeDetection.detectChanges();
        });
    }

    back() {
        this._route.navigateByUrl('/accounts/manage-account')
    }

    ngOnInit() {
        this.userId = this._commonService.getUserId();
        this.addAccountForm = this._formBuilder.group({
            accountName: ['', Validators.required],
            accountNo: ['', Validators.required],
            bankName: ['', Validators.required],
            accountType: ['', Validators.required],
            ifscCode: ['', Validators.required],
            initialAmount: null,
            userId: this.userId,
        });
    }

    get f() {
        return this.addAccountForm.controls;
    }

    ngAfterContentInit() {
        if (history.state.data) {
            this.updateFormData = history.state.data;
            this.isEdit = true;
            this.addAccountForm.patchValue(this.updateFormData);
            console.log(this.updateFormData);
        }
    }

    addOrEditAccount() {
        if (this.addAccountForm.invalid) {
            for (const control of Object.keys(this.addAccountForm.controls)) {
                this.addAccountForm.controls[control].markAsTouched();
            }
            return;
        }

        if (this.addAccountForm.valid) {
            if (history.state.data) {
                // console.log(history.state.data);
                // console.log(this.addAccountForm.value);
                this.addAccountForm.value.userId = this.userId;
                this.addAccountForm.value.id = history.state.data.id;
                this._accountService
                    .updateAccount(this.addAccountForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account updated successfully' });
                        this.addAccountForm.reset();
                        setTimeout(() => {
                            if (this.isAccessToManageAccounts) {
                                this._route.navigateByUrl('accounts/manage-account');
                            } else {
                                this._route.navigateByUrl('accounts/new-account');
                            }
                        }, 2000);
                        this.changeDetection.detectChanges();
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
            } else {
                this._accountService
                    .addAccount(this.addAccountForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addAccountForm.reset();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account added successfully' });
                        setTimeout(() => {
                            if (this.isAccessToManageAccounts) {
                                this._route.navigateByUrl('accounts/manage-account');
                            } else {
                                this._route.navigateByUrl('accounts/new-account');
                            }
                        }, 2000);
                        this.changeDetection.detectChanges();
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
            }
        }
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
