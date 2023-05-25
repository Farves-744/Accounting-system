import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private _commonService: CommonService
    ) { }

    addRole(value: any) {
        return this.http.post(
            environment.BASE_URL + '/add/role',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    updateRole(value: any) {
        return this.http.post(
            environment.BASE_URL + '/update/role',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    deleteRole(value: any) {
        return this.http.post(
            environment.BASE_URL + '/delete/role',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getRole(value: any) {
        return this.http.post(
            environment.BASE_URL + '/search/role',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getRoleById(value: any) {
        return this.http.post(
            environment.BASE_URL + '/role/by/id',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }

    getPermissions(value: any) {
        return this.http.post(
            environment.BASE_URL + '/get',
            value,
            this._commonService.httpOptions
        );
    }

    getPrivilegesByRoleId(value: any) {
        return this.http.post(
            environment.BASE_URL + '/role/by/id',
            { data: this._commonService.encryptData(value) },
            this._commonService.httpOptions
        );
    }
}
