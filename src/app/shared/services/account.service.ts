import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AddAccount, GetAccounts } from '../modals/accounts';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private _commonService: CommonService
    ) {}

    addAccount(value: any) {
        return this.http.post(
            environment.BASE_URL + '/add/account',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getAccount(value: GetAccounts) {
        return this.http.post(
            environment.BASE_URL + '/search/account',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    deleteAccount(value) {
        return this.http.post(
            environment.BASE_URL + '/delete/account',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    updateAccount(value: any) {
        return this.http.post(
            environment.BASE_URL + '/update/account',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    accountNumberValidate(value: any) {
        return this.http.post(
            environment.BASE_URL + '/account/check',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getAccountById(value: any) {
        return this.http.post(
            environment.BASE_URL + '/account/by/id',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getTransactions(value: any) {
        return this.http.post(
            environment.BASE_URL + '/transaction/search',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getProfitAndLoss(value: any) {
        return this.http.post(
            environment.BASE_URL + '/profit/loss',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }
}
