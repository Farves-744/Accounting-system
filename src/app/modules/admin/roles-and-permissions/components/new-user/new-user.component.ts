import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GetRole } from 'app/shared/modals/role';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { UserService } from 'app/shared/services/user.service';

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
    rolesData: any;

    constructor(
        private _commonService: CommonService,
        private _userService: UserService,
        private _roleService: RoleService,
        private _formBuilder: FormBuilder,
        private _route: Router,
        private changeDetection: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();

        this.addUserForm = this._formBuilder.group({
            name: '',
            email: '',
            password: '',
            editPassword: '',
            roleId: null,
            userId: this.userId,
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

    addOrEditUser() {
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
                        this.addUserForm.reset();
                        this._route.navigateByUrl(
                            'roles-and-permissions/manage-user'
                        );
                        this.changeDetection.detectChanges();
                    });
            } else {
                console.log(this.addUserForm.value);

                this._userService
                    .addUser(this.addUserForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addUserForm.reset();
                        this._route.navigateByUrl(
                            'roles-and-permissions/manage-user'
                        );
                        this.changeDetection.detectChanges();
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
}
