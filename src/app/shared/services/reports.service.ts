import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private _commonService: CommonService
    ) {}

    getIncomeReports(value: any) {
        return this.http.post(
            environment.BASE_URL + '/payment/report',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getIncomeReportsById(value: any) {
        return this.http.post(
            environment.BASE_URL + '/payments/id',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getExpenseReports(value: any) {
        return this.http.post(
            environment.BASE_URL + '/payment/report',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getExpenseReportsById(value: any) {
        return this.http.post(
            environment.BASE_URL + '/payments/id',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getAccountsName(value: any) {
        return this.http.post(
            environment.BASE_URL + '/search/account',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getAccountStatements(value: any) {
        return this.http.post(
            environment.BASE_URL + '/account/statement',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getTaxReports(value: any) {
        return this.http.post(
            environment.BASE_URL + '/tax/report',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }
}
