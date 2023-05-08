import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';

export interface Role {
    privileges: string;
}

const ELEMENT_DATA: Role[] = [
    {
        privileges: 'Dashboard',
    },
    {
        privileges: 'Income',
    },
    {
        privileges: 'Add Income',
    },
    {
        privileges: 'Income Categories',
    },
    {
        privileges: 'Expense',
    },
    {
        privileges: 'Add Expense',
    },
    {
        privileges: 'Expense Categories',
    },
    {
        privileges: 'Accounts',
    },
    {
        privileges: 'New Account',
    },
    {
        privileges: 'Manage Accounts',
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
        privileges: 'Add Tax',
    },
    {
        privileges: 'Manage Tax',
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
        privileges: 'New User',
    },
    {
        privileges: 'Manage Users',
    },
    {
        privileges: 'Manage Roles',
    },
];
@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {
    constructor(private commonService: CommonService, private router: Router) {}

    dataSource = ELEMENT_DATA;

    navigateToHome() {
        this.commonService.navigateToHome();
    }

    ngOnInit(): void {}
}
