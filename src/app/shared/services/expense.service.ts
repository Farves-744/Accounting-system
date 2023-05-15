import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ExpenseService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private _commonService: CommonService
    ) {}

    addCategoryImage(value: any) {
        return this.http.post(environment.BASE_URL + '/images', value);
    }

    addCategory(value: any) {
        return this.http.post(
            environment.BASE_URL + '/add/category',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    updateCategory(value: any) {
        return this.http.post(
            environment.BASE_URL + '/update/category',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    deleteCategory(value: any) {
        return this.http.post(
            environment.BASE_URL + '/delete/category',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getCategory(value: any) {
        return this.http.post(
            environment.BASE_URL + '/search/category',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    filterByCategory(value: any) {
        return this.http.post(
            environment.BASE_URL + '/category/wise/payments',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    addExpense(value: any) {
        return this.http.post(
            environment.BASE_URL + '/add/cash',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    updateExpense(value: any) {
        return this.http.post(
            environment.BASE_URL + '/update/cash',
            {
                data: this._commonService.encryptData(value),
            },
            this._commonService.httpOptions
        );
    }

    getExpenseById(value: any) {
        return this.http.post(
            environment.BASE_URL + '/get/update/details',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }
}
