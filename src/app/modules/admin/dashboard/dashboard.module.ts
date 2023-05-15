import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'app/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

const dashboardRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent,
    },
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        RouterModule.forChild(dashboardRoutes),
        NgApexchartsModule,
        MaterialExampleModule,
        FormsModule,
        CommonModule,
    ],
})
export class DashboardModule {}
