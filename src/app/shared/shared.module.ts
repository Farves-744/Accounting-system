import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DndDirective } from './directives/dnd.directive';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, DndDirective],
    declarations: [DndDirective],
})
export class SharedModule {}
