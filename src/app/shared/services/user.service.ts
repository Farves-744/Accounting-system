import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private _commonService: CommonService
    ) {}

    addUser(value: any) {
        return this.http.post(
            environment.BASE_URL + '/add/user',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    updateUser(value: any) {
        return this.http.post(
            environment.BASE_URL + '/update/user',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    deleteUser(value: any) {
        return this.http.post(
            environment.BASE_URL + '/delete/user',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getUser(value: any) {
        return this.http.post(
            environment.BASE_URL + '/search/user',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }
}
