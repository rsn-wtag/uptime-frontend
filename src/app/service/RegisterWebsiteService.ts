import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {properties} from "../properties";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegisterWebsiteService {
  constructor(private  http: HttpClient) {

  }

  registerWebsite(registerWebsite: WebsiteDetails):Observable<any>{
    return this.http.post(properties.apiUrl+'website-registration/register-website',
      registerWebsite,
      {withCredentials:true}
    );
  }
}
