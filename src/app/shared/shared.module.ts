import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DndDirective } from './directives/dnd.directive';
import { ToasterComponent } from './toaster/toaster/toaster.component';
import { ToasterContainerComponent } from './toaster/toaster-container/toaster-container.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DndDirective,
        ToasterComponent,
        ToasterContainerComponent,
        ToastModule,
        ButtonModule,
    ],
    declarations: [DndDirective, ToasterComponent, ToasterContainerComponent],
    providers: [MessageService],
})
export class SharedModule { }
