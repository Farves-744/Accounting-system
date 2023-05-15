import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Toast } from 'app/shared/modals/toaster';

@Component({
    selector: 'app-toaster',
    templateUrl: './toaster.component.html',
    styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent {
    constructor() {}

    ngOnInit(): void {}

    @Input() toast: Toast;
    @Input() i: number;

    @Output() remove = new EventEmitter<number>();
}
