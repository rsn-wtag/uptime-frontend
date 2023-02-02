import {HTTP_INTERCEPTORS, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {UserStorageService} from "../service/user-storage.service";
import {Observable, of, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";



//const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: UserStorageService, private  router:Router) { }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {

    if (err.status === 401 || err.status === 403) {
      this.tokenStorage.removeUserFromStorage();

      this.router.navigate(['/login']).then(()=>{
        window.location.reload();});

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
    if(!req.url.includes('login',0))
        return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)));
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
