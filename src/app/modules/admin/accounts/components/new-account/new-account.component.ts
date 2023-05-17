import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
    selector: 'app-new-account',
    templateUrl: './new-account.component.html',
    styleUrls: ['./new-account.component.scss'],
})
export class NewAccountComponent {
    addAccountForm: FormGroup;
    updateFormData: any = undefined;
    userId: any;
    isEdit: boolean = false; // this is for toggle button text add or edit
    response: any;

    // addAccountModal: AddAccount = new AddAccount();

    constructor(
        private _commonService: CommonService,
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private changeDetection: ChangeDetectorRef,
        private toaster: ToasterService
    ) { }
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
                alert('This account number is already exist.');
                event.target.value = '';
            }
            this.changeDetection.detectChanges();
        });
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
                        this.addAccountForm.reset();
                        this._route.navigateByUrl('accounts/manage-account');
                        this.changeDetection.detectChanges();
                    });
            } else {
                this._accountService
                    .addAccount(this.addAccountForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addAccountForm.reset();
                        this.toaster.show(
                            'success',
                            'Account added successfully'
                        );
                        setTimeout(() => {
                            this._route.navigateByUrl('accounts/manage-account');
                        }, 2000);
                        this.changeDetection.detectChanges();
                    });
            }
        }
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }
}
