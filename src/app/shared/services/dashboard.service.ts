import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private _commonService: CommonService
    ) {}

    getDashboardTransactions(value: any) {
        return this.http.post(
            environment.BASE_URL + '/dashboard/transaction',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getDashboardCards(value: any) {
        return this.http.post(
            environment.BASE_URL + '/dashboard/card',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getAreaGraphData(value: any) {
        return this.http.post(
            environment.BASE_URL + '/income/expense/graph',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getPolarGraphData(value: any) {
        return this.http.post(
            environment.BASE_URL + '/profit/loss/graph',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }
}
