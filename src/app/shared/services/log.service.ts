import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private _commonService: CommonService
  ) { }

  getLogs(value: any) {
    return this.http.post(
      environment.BASE_URL + '/logs',
      {
        data: this._commonService.encryptData(value),
      },
      this._commonService.httpOptions
    );
  }
}
