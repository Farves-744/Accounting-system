import { Injectable } from '@angular/core';
import { AddIncomeCategory } from '../modals/income-category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import CryptoJS, { AES } from 'crypto-js';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    constructor(private http: HttpClient, private router: Router) { }
    env = environment;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
    };

    navigateToHome() {
        this.router.navigateByUrl('/dashboard');
    }

    encryptData(value: any) {
        return AES.encrypt(
            JSON.stringify(value),
            this.env.SECRET_KEY
        ).toString();
    }

    decryptData(value: any) {
        return JSON.parse(
            AES.decrypt(value.data, this.env.SECRET_KEY).toString(
                CryptoJS.enc.Utf8
            )
        );
    }

    getUserId() {
        return parseInt(localStorage.getItem('userId'));
    }

    uniqueCheck(value: any) {
        return this.http.post(
            environment.BASE_URL + '/unique/check',
            { data: this.encryptData(value) },
            this.httpOptions
        );
    }
}
