import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor() {
    }

    static urlList: any

    ngOnInit() {
        if (localStorage.getItem('privileges')) {
            var menusFilterList = localStorage.getItem('privileges').toString()
            AppComponent.urlList = menusFilterList.split(',')
        }
        console.log(AppComponent.urlList);
    }

    static checkUrl(option) {
        for (let roleOption of AppComponent.urlList)
            if (option == roleOption)
                return true
        return false;
    }
}
