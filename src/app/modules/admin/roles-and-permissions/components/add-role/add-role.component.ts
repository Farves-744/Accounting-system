import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { AddRole, GetRoleById, privilege } from 'app/shared/modals/role';
import { CommonService } from 'app/shared/services/common.service';
import { RoleService } from 'app/shared/services/role.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss']


})
export class AddRoleComponent implements OnInit {
    constructor(
        private _commonService: CommonService,
        private messageService: MessageService,
        private _roleService: RoleService,
        private _route: Router,
        private _formBuilder: FormBuilder,
        private changeDetection: ChangeDetectorRef
    ) {
        this.isAccessToManageRole = (AppComponent.checkUrl("manageRoles"))
        this.dashboardAccess = (AppComponent.checkUrl("dashboards"))
    }

    roleModal: AddRole = new AddRole();
    getRoleByIdModal: GetRoleById = new GetRoleById()
    permissionData: any
    addRoleForm: FormGroup;
    // dataSource = rolesData;
    userId: any;
    updateFormData: any = undefined;
    permissions: any = [];


    isDisabled: boolean = false;

    // New Codes
    // menuRows: Array<privilege>;
    menuRows: any;
    privileges = ['dashboards',
        'incomes',
        'addIncomes',
        'addIncomesAdd',
        'addIncomesEdit',
        'addIncomesDelete',
        'manageIncomes',
        'manageIncomesAdd',
        'manageIncomesEdit',
        'manageIncomesDelete',
        'incomeCategories',
        'incomeCategoriesAdd',
        'incomeCategoriesEdit',
        'incomeCategoriesDelete',
        'expenses',
        'addExpenses',
        'addExpensesAdd',
        'addExpensesEdit',
        'addExpensesDelete',
        'manageExpenses',
        'manageExpensesAdd',
        'manageExpensesEdit',
        'manageIncomesDelete',
        'ExpenseCategories',
        'ExpenseCategoriesAdd',
        'ExpenseCategoriesEdit',
        'ExpenseCategoriesDelete',
        'accounts',
        'addAccounts',
        'addAccountsAdd',
        'addAccountsEdit',
        'addAccountsDelete',
        'manageAccounts',
        'manageAccountsAdd',
        'manageAccountsEdit',
        'manageAccountsDelete',
        'transaction',
        'transactionsAdd',
        'transactionsEdit',
        'transactionsDelete', 'profitAndLoss',
        'profitAndLossAdd',
        'profitAndLossEdit',
        'profitAndLossDelete',
        'taxes',
        'addTax',
        'addTaxAdd',
        'addTaxEdit',
        'addTaxDelete',
        'manageTax',
        'manageTaxAdd',
        'manageTaxEdit',
        'manageTaxDelete',
        'taxStatements',
        'taxStatementsAdd',
        'taxStatementsEdit',
        'taxStatementsDelete',
        'reports',
        'incomeReports',
        'incomeReportsAdd',
        'incomeReportsEdit',
        'incomeReportsDelete',
        'expenseReports',
        'expenseReportsAdd',
        'expenseReportsEdit',
        'expenseReportsDelete',
        'taxReports',
        'taxReportsAdd',
        'taxReportsEdit',
        'taxReportsDelete',
        'accountsStatement',
        'accountsStatementAdd',
        'accountsStatementEdit',
        'accountsStatementDelete',
        'rolesAndPermissions',
        'newUsers',
        'newUsersAdd',
        'newUsersEdit',
        'newUsersDelete',
        'manageUsers',
        'manageUsersAdd',
        'manageUsersEdit',
        'manageUsersDelete',
        'manageRoles',
        'manageRolesAdd',
        'manageRolesEdit',
        'manageRolesDelete',
        'logs'
    ]
    selected = [];
    roleFormGroup: FormGroup;

    isAccessToManageRole: any;
    dashboardAccess: any


    ngOnInit(): void {
        this.userId = this._commonService.getUserId();
        // this.roleFormGroup = this._formBuilder.group({
        //     'roleName': [null, Validators.required],
        // });

        this.getPrivileges()
        console.log(this.isDisabled);

        // this.privileges = this.sample
        console.log(this.privileges);

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

    showRequiredError() {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Enter Role Name' });
    }

    ngAfterContentInit() {
        if (history.state.data) {
            // console.log(history.state.data);

            // this.getRoleByIdModal.userId = this.userId;
            // this.getRoleByIdModal.id = history.state.data;

            // this._roleService
            //     .getRoleById(this.getRoleByIdModal)
            //     .subscribe((res) => {
            //         console.log(this._commonService.decryptData(res));
            //         this.updateFormData = this._commonService.decryptData(res);

            //         // this.addRoleForm.patchValue(this.updateFormData);
            //         // this.getRoleByIdModal = this.updateFormData
            //         console.log(this.updateFormData);
            //         this.changeDetection.detectChanges();
            //         this.roleModal = this.updateFormData
            //     });

            // // this.updateFormData = history.state.data;

            this.serviceCall()
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


                    setTimeout(() => {
                        if (this.isAccessToManageRole) {
                            this._route.navigateByUrl(
                                'roles-and-permissions/manage-roles'
                            );
                        } else {
                            this._route.navigateByUrl(
                                'roles-and-permissions/manage-roles'
                            );
                        }
                    }, 2000);


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

    sselectAll(event) {
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

    getPermissions() {
        this._roleService.getPermissions({}).subscribe((res) => {
            console.log(res);
            this.permissionData = res
        })
    }

    // New Codes
    getPrivileges() {
        // var req = { userId: this.userId, token: this.token }
        this._roleService.getPermissions({}).subscribe(data => {
            this.menuRows = data;
            console.log(this.menuRows)
            var menus = []
            var sno = 0;
            var parentId = 1
            for (let menu of this.menuRows) {
                if (menu.isChild == 0 && menu.actions == 1) {
                    parentId = menu.id
                    console.log(parentId);
                    console.log(menu.privileges);
                    if (this.checkPrivilege(menu.privileges)) {
                        var viewAccess = false
                        if (menu.id == 1)
                            viewAccess = true
                        menus.push({ sno: ++sno, 'id': menu.id, 'privilege': menu.privileges, 'isChild': menu.isChild, 'parentId': parentId, 'length': menu.length, 'name': menu.name, view: viewAccess, add: false, edit: false, delete: false })
                        console.log(menus);
                    }
                }

                else if (menu.isChild == 1) {
                    if (menu.actions == 1)
                        if (this.checkPrivilege(menu.privileges))
                            menus.push({ sno: ++sno, 'id': menu.id, 'privilege': menu.privileges, 'isChild': menu.isChild, 'parentId': parentId, 'length': menu.length, 'name': menu.name, view: false, add: false, edit: false, delete: false })
                    console.log(menus);
                }


            }
            console.log(this.menuRows)
            console.log(menus)
            this.menuRows = menus
            this.selected.push(this.menuRows[0])
            this.changeDetection.detectChanges();
            console.log(this.menuRows);
            console.log(this.selected);
        })
    }

    checkPrivilege(privilege) {
        for (let pri of this.privileges) {
            if (pri === privilege)
                return true
        }
        return false
    }

    checkRolePrivilegeById(id) {
        for (let privilegeId of this.roleModal.permissions) {
            if (privilegeId == id)
                return true
        }
        return false
    }

    back() {
        this._route.navigateByUrl('/roles-and-permissions/manage-roles')
    }

    onCheck(field, index) {
        console.log(this.menuRows);

        console.log(field + "--" + index + "--" + this.menuRows[index][field]);
        if (field == 'view' && this.menuRows[index]['view'] == false) {
            console.log("ViewFalse")
            this.menuRows[index]['add'] = false
            this.menuRows[index]['edit'] = false
            this.menuRows[index]['delete'] = false
            var checkIndex = this.selected.findIndex(x => x.sno == this.menuRows[index]['sno'])
            this.selected.splice(checkIndex, 1)

            var parentId = this.menuRows[index]['parentId']
            var Id = this.menuRows[index]['parentId']

            if (parentId == Id) {
                var parentIndex = this.menuRows.findIndex(x => x.id == parentId)
                console.log(parentIndex)
                console.log(this.menuRows[parentIndex])
                var childTrue = 0;
                if (this.menuRows[parentIndex]['length'] > 0) {
                    for (let i = parentIndex + 1; i <= (this.menuRows[parentIndex]['length'] + parentIndex - 1); i++) {
                        console.log(i)
                        console.log(this.menuRows[i])
                        if (this.menuRows[i]['view'] == true) {
                            childTrue = 1;
                        }
                    }
                }
                if (childTrue == 0) {
                    console.log('view')
                    this.menuRows[parentIndex]['view'] = false
                    var selectedParentIndex = this.selected.findIndex(x => x.sno == this.menuRows[parentIndex]['sno'])
                    this.selected.splice(selectedParentIndex, 1)
                }
            }
        }
        else if (field != 'view' && (this.menuRows[index]['add'] == true || this.menuRows[index]['edit'] == true || this.menuRows[index]['delete'] == true)) {
            // console.log("true")
            this.menuRows[index]['view'] = true
            var checkIndex = this.selected.findIndex(x => x.sno == this.menuRows[index]['sno'])
            if (checkIndex === -1) {
                this.selected.push(this.menuRows[index]);
            }
            else {
                this.selected[checkIndex] = this.menuRows[index]
            }
        }

        if (this.menuRows[index]['view'] == true) {
            // console.log("ViewTrue")
            var checkIndex = this.selected.findIndex(x => x.sno == this.menuRows[index]['sno'])
            if (checkIndex === -1) {
                this.selected.push(this.menuRows[index]);
            }
            else {
                this.selected[checkIndex] = this.menuRows[index]
            }
            var parentIndex = this.menuRows.findIndex(x => x.id == this.menuRows[index]['parentId'])
            if (this.menuRows[parentIndex]['view'] == false) {
                this.menuRows[parentIndex]['view'] = true
                var checkIndex = this.selected.findIndex(x => x.sno == this.menuRows[parentIndex]['sno'])
                if (checkIndex === -1) {
                    this.selected.push(this.menuRows[parentIndex]);
                }
                else {
                    this.selected[checkIndex] = this.menuRows[parentIndex]
                }
            }
        }
        console.log(this.selected);
        this.changeDetection.detectChanges();
    }



    updateRole() {
        var privilegeArray = []
        for (let row of this.selected) {
            if (row.view == true)
                privilegeArray.push(row.id)
            if (row.add == true)
                privilegeArray.push(row.id + 1)
            if (row.edit == true)
                privilegeArray.push(row.id + 2)
            if (row.delete == true)
                privilegeArray.push(row.id + 3)
        }
        console.log(privilegeArray)
        privilegeArray.sort(function (a, b) { return a - b });
        this.roleModal.permissions = privilegeArray
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
        }
        else {
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
    }

    selectAll(event) {
        if (event.target.checked == true) {
            for (let row of this.menuRows) {
                row.edit = true
                row.add = true
                row.delete = true
                row.view = true
                this.selected.push(row)
            }
        } else {
            for (let row of this.menuRows) {
                row.edit = false
                row.add = false
                row.delete = false
                row.view = false
            }
            this.selected = []
            this.selected.push(this.menuRows[0])
        }

        console.log(this.menuRows);
    }

    serviceCall() {
        this.getRoleByIdModal.userId = this.userId;
        this.getRoleByIdModal.id = history.state.data;
        this._roleService.getRoleById(this.getRoleByIdModal).subscribe(res => {
            console.log(this._commonService.decryptData(res));
            var retData = this._commonService.decryptData(res)
            // var retData = JSON.parse(JSON.stringify(data))
            this.roleModal.permissions = retData.permissions
            this.roleModal.roleName = retData.roleName
            this.updateFormData = retData


            console.log(this.menuRows)
            for (let menu of this.menuRows) {
                if (menu.isChild == 0) {
                    if (menu.id == 1)
                        this.selected.push(menu)
                    else {
                        if (menu.length == 4) {
                            menu.view = this.checkRolePrivilegeById(menu.id)
                            menu.add = this.checkRolePrivilegeById(menu.id + 1)
                            menu.edit = this.checkRolePrivilegeById(menu.id + 2)
                            menu.delete = this.checkRolePrivilegeById(menu.id + 3)
                        }
                        else
                            menu.view = this.checkRolePrivilegeById(menu.id)
                        if (menu.view)
                            this.selected.push(menu)
                    }
                }
                else if (menu.isChild == 1) {
                    menu.view = this.checkRolePrivilegeById(menu.id)
                    menu.add = this.checkRolePrivilegeById(menu.id + 1)
                    menu.edit = this.checkRolePrivilegeById(menu.id + 2)
                    menu.delete = this.checkRolePrivilegeById(menu.id + 3)
                    console.log(menu);

                    if (menu.view)
                        this.selected.push(menu)
                }
            }
            this.changeDetection.detectChanges();
        })
    }
}


