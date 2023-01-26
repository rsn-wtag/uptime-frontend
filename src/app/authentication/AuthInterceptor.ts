import {HTTP_INTERCEPTORS, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {TokenStorageService} from "../service/TokenStorageService";
import {Observable, of, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";



const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService, private  router:Router) { }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      //navigate /delete cookies or whatever
      this.router.navigateByUrl(`/login`);
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("coming....intercept");
    let authReq = req;
   // const token = this.tokenStorage.getToken();
    //if (token != null) {
    //  authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    //}
    return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
