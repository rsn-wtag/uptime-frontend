import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WebsiteDetails} from "../model/WebsiteDetails";
import {WebsiteService} from "../service/website.service";
import {ErrorMessage} from "../model/ErrorMessage";

@Component({
  selector: 'app-update-website',
  templateUrl: './update-website.component.html',
  styleUrls: ['./update-website.component.css']
})
export class UpdateWebsiteComponent implements OnInit {

  websiteDetails:WebsiteDetails= new WebsiteDetails();
  msg:string="";
  constructor(private route: ActivatedRoute , private updateWebsiteService:WebsiteService) {
    this.route.params.subscribe(params => {
      console.log(params); // {param: 'value'}
      this.updateWebsiteService.getWebsite(params['webId']).subscribe(data=>{
        if(data.body)
          this.websiteDetails= data.body as WebsiteDetails;
      },error => {

      });
    });
  }

  ngOnInit(): void {

  }

  Submit(){
    console.log("submit coming...");
    this.updateWebsiteService.updateWebsite(this.websiteDetails).subscribe(data=>{
      this.msg="Website Updated successfully";
    }, error=>{
      let errorObj= error.error as ErrorMessage;
      this.msg=errorObj.customMessage;
    });
  }

}
