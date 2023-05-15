import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Toast } from '../modals/toaster';

@Injectable({
    providedIn: 'root',
})
export class ToasterService {
    subject: BehaviorSubject<Toast>;
    toast$: Observable<Toast>;

    constructor() {
        this.subject = new BehaviorSubject<Toast>(null);
        this.toast$ = this.subject
            .asObservable()
            .pipe(filter((toast) => toast !== null));
    }

    show(type?, title?, body?, delay?) {
        this.subject.next({ type, title, body, delay });
    }
}
