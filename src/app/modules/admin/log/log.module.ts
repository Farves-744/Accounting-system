import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LogRoutingModule } from './log-routing.module';
import { LogComponent } from './log.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'app/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';

const logRoutes: Route[] = [
  {
    path: '',
    component: LogComponent,
  },
];

@NgModule({
  declarations: [
    LogComponent
  ],
  imports: [
    RouterModule.forChild(logRoutes),
    CommonModule,
    LogRoutingModule,
    SharedModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe,],
})
export class LogModule { }
