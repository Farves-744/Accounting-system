import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
// import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { AuthUtils } from './auth.utils';
import { CommonService } from 'app/shared/services/common.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private _commonService: CommonService, private _router: Router) {

    }

    env = environment;
    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Clone the request object
        let newReq = req.clone();



        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        // if (
        //     this._authService.accessToken &&
        //     !AuthUtils.isTokenExpired(this._authService.accessToken)
        // ) {
        // newReq = req.clone({
        //     headers: req.headers.set('Authorization', '' + localStorage.getItem('token')),
        // });

        const authToken = localStorage.getItem('token');

        if (authToken) {
            newReq = newReq.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        }
        // }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {
                // Catch "401 Unauthorized" responses
                if (
                    error.status === 603
                ) {
                    // Sign out
                    this._authService.signOut();
                    // localStorage.clear()
                    this._router.navigateByUrl('sign-in')
                    // Reload the app
                    // location.reload();
                }

                return throwError(error);
            })
        );
    }


}
