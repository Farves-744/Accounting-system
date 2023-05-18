import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetAccounts } from 'app/shared/modals/accounts';
import { GetRole } from 'app/shared/modals/role';
import { AccountService } from 'app/shared/services/account.service';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { UserService } from 'app/shared/services/user.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent {
    addUserForm: FormGroup;
    updateFormData: any = undefined;
    userId: any;
    isEdit: boolean = false; // this is for toggle button text add or edit
    roleModel: GetRole = new GetRole();
    getAccountsModel: GetAccounts = new GetAccounts();
    rolesData: any;
    accounts: any;

    constructor(
        private _commonService: CommonService,
        private _userService: UserService,
        private _roleService: RoleService,
        private _accountService: AccountService,
        private _formBuilder: FormBuilder,
        private messageService: MessageService,
        private _route: Router,
        private changeDetection: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();

        this.addUserForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            editPassword: ['', [Validators.required, Validators.minLength(6)]],
            roleId: [null, Validators.required],
            userId: this.userId,
            accountId: [null, Validators.required]
        });
        this.getRolesName();
    }

    ngAfterContentInit() {
        if (history.state.data) {
            this.updateFormData = history.state.data;
            this.isEdit = true;
            this.addUserForm.patchValue(this.updateFormData);
            console.log(this.updateFormData);
            this.addUserForm.value.password = '';
        }
    }

    get f() {
        return this.addUserForm.controls;
    }

    addOrEditUser() {
        if (this.addUserForm.invalid) {
            for (const control of Object.keys(this.addUserForm.controls)) {
                this.addUserForm.controls[control].markAsTouched();
            }
            return;
        }

        if (this.addUserForm.valid) {
            if (history.state.data) {
                console.log(history.state.data);
                console.log(this.addUserForm.value);
                this.addUserForm.value.userId = this.userId;
                this.addUserForm.value.id = history.state.data.id;
                this.addUserForm.value.password =
                    this.addUserForm.value.editPassword == ''
                        ? this.addUserForm.value.password
                        : this.addUserForm.value.editPassword;

                console.log(this.addUserForm.value.password);
                console.log(this.addUserForm.value.editPassword);

                this._userService
                    .updateUser(this.addUserForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
                        this.addUserForm.reset();
                        this._route.navigateByUrl(
                            'roles-and-permissions/manage-user'
                        );
                        this.changeDetection.detectChanges();
                    }, error => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
            } else {
                console.log(this.addUserForm.value);

                this._userService
                    .addUser(this.addUserForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully' });
                        this.addUserForm.reset();
                        this._route.navigateByUrl(
                            'roles-and-permissions/manage-user'
                        );
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



    getRolesName() {
        this.roleModel.userId = this.userId;

        this._roleService.getRole(this.roleModel).subscribe((res) => {
            console.log(this._commonService.decryptData(res));
            this.rolesData = this._commonService.decryptData(res);
            console.log(this.rolesData);
            this.changeDetection.detectChanges();
        });
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
            }, (error) => {
                console.log(error);
            });
    }
}
