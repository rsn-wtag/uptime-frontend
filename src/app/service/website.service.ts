import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {properties} from "../properties";

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  constructor(private  http: HttpClient) {

  }

  registerWebsite(registerWebsite: WebsiteDetails){
    let url=registerWebsite.url;
   /* if(registerWebsite.url) {
      url= encodeURIComponent(registerWebsite.url.toString());
      console.log(url+'----------------');
    }*/
    return this.http.post(properties.apiUrl+'websites',
      {url: url,
        websiteName:registerWebsite.websiteName},
      {
        observe: 'response',
        withCredentials:true}
    );
  }

  getWebsite(webId):Observable<HttpResponse<WebsiteDetails>> {

    return this.http.get<WebsiteDetails>(properties.apiUrl + "websites/"+webId,
      {
        observe: 'response',
        withCredentials: true
      });
  }

  updateWebsite(websiteDetails:WebsiteDetails){
    return this.http.patch(properties.apiUrl + "websites/"+websiteDetails.webId,
      {url: websiteDetails.url,
        websiteName:websiteDetails.websiteName
      }
      ,
      {
        observe: 'response',
        withCredentials: true
      });
  }


  getWebsiteList():Observable<HttpResponse<WebsiteDetails[]>> {
    return this.http.get<WebsiteDetails[]>(properties.apiUrl + "websites",
      {
        observe: 'response',
        withCredentials: true
      });
  }

  removeWebsite( webId){
    return this.http.delete(properties.apiUrl+'websites/'+webId, {withCredentials:true});
  }
}
