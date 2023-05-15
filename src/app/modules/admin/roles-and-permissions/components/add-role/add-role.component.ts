import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from 'app/shared/modals/role';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {
    constructor(
        private _commonService: CommonService,
        private _roleService: RoleService,
        private _route: Router,
        private _formBuilder: FormBuilder,
        private changeDetection: ChangeDetectorRef
    ) {}

    addRoleForm: FormGroup;
    // dataSource = rolesData;
    userId: any;
    updateFormData: any = undefined;
    permissions: any = [];

    isDisabled: boolean = false;

    rolesData: Role[] = [
        {
            privileges: 'Dashboard',
        },
        {
            privileges: 'Income',
        },

        {
            privileges: 'Income Categories',
        },
        {
            privileges: 'Expense',
        },

        {
            privileges: 'Expense Categories',
        },
        {
            privileges: 'Accounts',
        },

        {
            privileges: 'Transactions',
        },
        {
            privileges: 'Profit and Loss',
        },
        {
            privileges: 'Tax',
        },

        {
            privileges: 'Tax Statement',
        },
        {
            privileges: 'Reports',
        },
        {
            privileges: 'Income Report',
        },
        {
            privileges: 'Expense Report',
        },
        {
            privileges: 'Tax Report',
        },
        {
            privileges: 'Account Statement',
        },
        {
            privileges: 'Roles and Permissions',
        },
        {
            privileges: 'Users',
        },
        {
            privileges: 'Roles and Permissions',
        },
    ];

    ngOnInit(): void {
        this.userId = this._commonService.getUserId();

        this.addRoleForm = this._formBuilder.group({
            roleName: '',
            permissions: [],
            userId: this.userId,
        });
    }

    // getRoleById() {
    //     this._roleService.getRoleById(history.state.data).subscribe((res) => {
    //         console.log(this._commonService.decryptData(res));
    //         this.changeDetection.detectChanges();
    //     });
    // }

    ngAfterContentInit() {
        if (history.state.data) {
            console.log(history.state.data);

            this.addRoleForm.value.userId = this.userId;
            this.addRoleForm.value.id = history.state.data;

            this._roleService
                .getRoleById(this.addRoleForm.value)
                .subscribe((res) => {
                    console.log(this._commonService.decryptData(res));
                    this.updateFormData = this._commonService.decryptData(res);

                    this.addRoleForm.patchValue(this.updateFormData);
                    console.log(this.updateFormData);
                    this.changeDetection.detectChanges();
                });

            // this.updateFormData = history.state.data;
        }
    }

    addPermission(event) {
        console.log(event.checked);
        console.log(event.source.name);
        if (event.checked) {
            this.permissions.push(event.source.name);
        } else {
            if (this.permissions != null) {
                this.permissions.splice(
                    this.permissions.indexOf(event.source.name),
                    1
                );
            }
        }
        // this.permissions = event.source.name;
        console.log(this.permissions);
    }

    addOrEditRole() {
        if (this.addRoleForm.valid) {
            if (this.updateFormData) {
                console.log(this.updateFormData);
                console.log(this.addRoleForm.value);
                this.addRoleForm.value.userId = this.userId;
                this.addRoleForm.value.id = this.updateFormData.id;
                this._roleService
                    .updateRole(this.addRoleForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addRoleForm.reset();
                        this._route.navigateByUrl(
                            'roles-and-permissions/manage-roles'
                        );
                        this.changeDetection.detectChanges();
                    });
            } else {
                this.addRoleForm.value.permissions = this.permissions;
                console.log(this.addRoleForm.value);
                this._roleService
                    .addRole(this.addRoleForm.value)
                    .subscribe((res) => {
                        console.log(this._commonService.decryptData(res));
                        this.addRoleForm.reset();
                        this._route.navigateByUrl(
                            'roles-and-permissions/manage-roles'
                        );
                        this.changeDetection.detectChanges();
                    });
            }
        }
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    selectAll(event) {
        if (event.checked) {
            if (this.permissions.length == 0) {
                for (let i = 1; i <= 40; i++) {
                    this.permissions.push(String(i));
                    // console.log(i);
                }

                console.log(this.permissions);
                this.addRoleForm.value.permissions = this.permissions;
                console.log(this.addRoleForm.value.permissions);
                // this.rolesData.isDisabled = false
                this.isDisabled = true;
            } else {
                this.isDisabled = true;
            }
        } else {
            for (let i = 1; i <= 40; i++) {
                this.permissions.pop(String(i));
                // console.log(i);
            }

            console.log(this.permissions);
            this.addRoleForm.value.permissions = this.permissions;
            console.log(this.addRoleForm.value.permissions);
            // this.rolesData.isDisabled = false
            this.isDisabled = false;
        }
    }
}
