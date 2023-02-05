import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {properties} from "../properties";
import {User} from "../model/User";
import {Observable} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) {
  }
  editUser(user:User):Observable<HttpResponse<User>>{
    return this.http.patch<User>(properties.apiUrl+ 'users/'+user.userId,
      {
        userName:user.userName,
        email:user.email,
        slackId:user.slackId
      }
    , {
        observe: 'response',
        withCredentials: true
      });
  }
}
