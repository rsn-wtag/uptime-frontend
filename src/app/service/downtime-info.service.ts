import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {properties} from "../properties";
import {DownTimeSummary} from "../model/DownTimeSummary";
import {DownTime} from "../model/DownTime";

@Injectable({
  providedIn: 'root'
})
export class DowntimeInfoService {

  constructor(private  http: HttpClient) {}



  getWebsiteDayWiseDownTimeHistory(webId){
    return this.http.get<DownTimeSummary[]>(
      properties.apiUrl + "websites/"+webId+"/down-time-summary",
      {
        observe: 'response',
        withCredentials: true
      }

    )
  }

  getTodayDownTimeHistoryToday(webId: number) {
    return this.http.get<DownTime[]>(
      properties.apiUrl + "websites/"+webId+"/today-down-time-histories",
      {
        observe: 'response',
        withCredentials: true
      }
    )
  }
}
