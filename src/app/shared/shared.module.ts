import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DndDirective } from './directives/dnd.directive';
import { ToasterComponent } from './toaster/toaster/toaster.component';
import { ToasterContainerComponent } from './toaster/toaster-container/toaster-container.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DndDirective,
        ToasterComponent,
        ToasterContainerComponent,
    ],
    declarations: [DndDirective, ToasterComponent, ToasterContainerComponent],
})
export class SharedModule {}
