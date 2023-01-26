import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {properties} from "../properties";

@Injectable({
  providedIn: 'root'
})
export class UpdateWebsiteService {

  constructor(private  http: HttpClient) {

  }

  getWebsite(userId, webId):Observable<HttpResponse<WebsiteDetails>> {

    return this.http.get<WebsiteDetails>(properties.apiUrl + "website-management/users/"+userId+"/websites/"+webId,
      {
        observe: 'response',
        withCredentials: true
      });
  }

  updateWebsite(websiteDetails:WebsiteDetails){

    return this.http.post(properties.apiUrl + "website-management/update-website",
      websiteDetails
      ,
      {
        observe: 'response',
        withCredentials: true
      });
  }

}
