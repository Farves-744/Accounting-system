import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddRole, GetRoleById } from 'app/shared/modals/role';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {
    constructor(
        private _commonService: CommonService,
        private messageService: MessageService,
        private _roleService: RoleService,
        private _route: Router,
        private _formBuilder: FormBuilder,
        private changeDetection: ChangeDetectorRef
    ) { }

    roleModal: AddRole = new AddRole();
    getRoleByIdModal: GetRoleById = new GetRoleById()

    // addRoleForm: FormGroup;
    // dataSource = rolesData;
    userId: any;
    updateFormData: any = undefined;
    permissions: any = [];

    isDisabled: boolean = false;

    rolesData = [
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



        console.log(this.isDisabled);



        // this.addRoleForm = this._formBuilder.group({
        //     roleName: ['', Validators.required],
        //     permissions: [[]],
        //     userId: this.userId,
        // });
    }

    // getRoleById() {
    //     this._roleService.getRoleById(history.state.data).subscribe((res) => {
    //         console.log(this._commonService.decryptData(res));
    //         this.changeDetection.detectChanges();
    //     });
    // }

    // get f() {

    //     return this.addRoleForm.controls;
    // }

    ngAfterContentInit() {
        if (history.state.data) {
            console.log(history.state.data);

            this.getRoleByIdModal.userId = this.userId;
            this.getRoleByIdModal.id = history.state.data;

            this._roleService
                .getRoleById(this.getRoleByIdModal)
                .subscribe((res) => {
                    console.log(this._commonService.decryptData(res));
                    this.updateFormData = this._commonService.decryptData(res);

                    // this.addRoleForm.patchValue(this.updateFormData);
                    // this.getRoleByIdModal = this.updateFormData
                    console.log(this.updateFormData);
                    this.changeDetection.detectChanges();
                    this.roleModal = this.updateFormData
                });

            // this.updateFormData = history.state.data;
        }
    }

    addPermission(event) {
        console.log(event.checked);
        console.log(event.source.name);
        if (event.checked) {
            this.permissions = this.roleModal.permissions.filter((value, index, self) => {
                return self.indexOf(value) === index;
            })

            this.permissions.push(event.source.name);
            this.roleModal.permissions = this.permissions
            console.log(this.roleModal.permissions);

        } else {
            if (this.permissions != null) {
                this.permissions = this.roleModal.permissions.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                })

                this.permissions.splice(
                    this.permissions.indexOf(event.source.name),
                    1
                );
                this.roleModal.permissions = this.permissions
                console.log(this.roleModal.permissions);
            }
        }
    }

    addOrEditRole() {

        // if (this.addRoleForm.invalid) {
        //     for (const control of Object.keys(this.addRoleForm.controls)) {
        //         this.addRoleForm.controls[control].markAsTouched();
        //     }
        //     return;
        // }


        // if (this.addRoleForm.valid) {
        if (this.updateFormData) {
            console.log(this.updateFormData);
            console.log(this.roleModal);
            this.roleModal.userId = this.userId;
            this.roleModal.id = this.updateFormData.id;
            this._roleService
                .updateRole(this.roleModal)
                .subscribe((res) => {
                    console.log(this._commonService.decryptData(res));
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role updated successfully' });
                    // this.addRoleForm.reset();
                    this.roleModal = new AddRole()
                    this._route.navigateByUrl(
                        'roles-and-permissions/manage-roles'
                    );
                    this.changeDetection.detectChanges();
                },
                    (error) => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
        } else {
            this.roleModal.userId = this.userId
            console.log(this.roleModal);
            this._roleService
                .addRole(this.roleModal)
                .subscribe((res) => {
                    console.log(this._commonService.decryptData(res));
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role added successfully' });
                    this.roleModal = new AddRole()
                    this._route.navigateByUrl(
                        'roles-and-permissions/manage-roles'
                    );
                    this.changeDetection.detectChanges();
                },
                    (error) => {
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    });
        }
        // }
    }

    navigateToHome() {
        this._commonService.navigateToHome();
    }

    selectAll(event) {
        if (event.checked) {
            if (this.permissions.length == 0) {
                for (let i = 1; i <= 40; i++) {
                    this.permissions.push(String(i));
                }

                console.log(this.permissions);
                this.roleModal.permissions = this.permissions;
                console.log(this.roleModal.permissions);
                this.isDisabled = true;
                console.log(this.isDisabled);

            } else {
                this.isDisabled = true;
                console.log(this.isDisabled);
                for (let i = 1; i <= 40; i++) {
                    if (!this.permissions.includes(i)) {
                        this.permissions.push(String(i));
                    }
                }
                this.permissions = this.roleModal.permissions.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                })
                this.roleModal.permissions = this.permissions

                console.log(this.roleModal.permissions);

            }
        } else {
            for (let i = 1; i <= 40; i++) {
                this.permissions.pop(String(i));
            }

            this.roleModal.permissions = this.permissions;
            console.log(this.roleModal.permissions);
            this.isDisabled = false;

        }
    }
}
