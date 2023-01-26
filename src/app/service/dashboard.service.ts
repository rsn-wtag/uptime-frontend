import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {properties} from "../properties";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {Observable} from "rxjs";
import {DownTimeSummary} from "../model/DownTimeSummary";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private  http: HttpClient) {

  }

   getWebsiteList(userId):Observable<HttpResponse<WebsiteDetails[]>> {

    return this.http.get<WebsiteDetails[]>(properties.apiUrl + "website-management/users/"+userId+"/websites",
      {
        observe: 'response',
        withCredentials: true
      });
  }

  removeWebsite(userId, webId){
    return this.http.delete(properties.apiUrl+'website-management/users/'+userId+'/remove-website/'+webId, {withCredentials:true});
  }


  getWebsiteDayWiseDownTimeHistory(webId){
    return this.http.get<DownTimeSummary[]>(
      properties.apiUrl + "website-management/websites/"+webId+"/down-time-history",
      {
        observe: 'response',
        withCredentials: true
      }

    )
  }

}
