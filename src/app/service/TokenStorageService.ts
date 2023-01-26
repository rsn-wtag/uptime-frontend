import {Injectable} from "@angular/core";
import {User} from "../model/User";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor( ) {
  }

  logout() {
    window.localStorage.clear();

  }

  public getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user) {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));


  }

  public getUser(){
    let user=window.localStorage.getItem(USER_KEY);

    return user!=null? JSON.parse(user): new User();
  }
}
