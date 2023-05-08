import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesAndPermissionsRoutingModule } from './roles-and-permissions-routing.module';
import { ManageRolesComponent } from './components/manage-roles/manage-roles.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { MaterialExampleModule } from 'app/material.module';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ShowDialogComponent } from './components/show-dialog/show-dialog.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { DeleteRoleDialogComponent } from './components/delete-role-dialog/delete-role-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ManageRolesComponent,
        NewUserComponent,
        ManageUserComponent,
        DeleteDialogComponent,
        ShowDialogComponent,
        AddRoleComponent,
        DeleteRoleDialogComponent,
    ],
    imports: [
        CommonModule,
        RolesAndPermissionsRoutingModule,
        MaterialExampleModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class RolesAndPermissionsModule {}
