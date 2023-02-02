import {Injectable} from "@angular/core";
import {User} from "../model/User";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor( ) {
  }

  removeUserFromStorage() {
    window.localStorage.clear();

  }

  public getUser(){
    let user=window.localStorage.getItem(USER_KEY);

    return user!=null? JSON.parse(user): new User();
  }
}
