import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {User} from "../model/User";
import {properties} from "../properties";
import {JwtResponse} from "../model/JwtResponse";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TokenStorageService} from "./TokenStorageService";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials:true
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient ) {
    // @ts-ignore
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(user: User){
      return this.http.post<any>(properties.apiUrl+'auth/login',{
        username: user.userName,
        password:user.password
      }, httpOptions)
        .pipe(map(resp => {
          console.log("=================coming login....");
          let data=resp as JwtResponse;
          user.userId=data.userId;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return user;
      }));
  }

  logout(){
    return this.http.get(properties.apiUrl+'auth/logout',httpOptions);
  }
  register(user){
    return this.http.post<JwtResponse>(properties.apiUrl+ 'auth/signup', {
      username: user.userName,
      email: user.email,
      password: user.password,
      slackId: user.slackId

    }, httpOptions)
      .pipe(map(resp => {
      console.log("=================coming register....");
      let data=resp as JwtResponse;
      user.userId=data.userId;
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);

      return user;
    }));
  }


}
