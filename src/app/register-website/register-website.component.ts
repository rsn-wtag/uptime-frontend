import { Component, OnInit } from '@angular/core';
import {WebsiteDetails} from "../model/WebsiteDetails";
import {TokenStorageService} from "../service/TokenStorageService";
import {RegisterWebsiteService} from "../service/RegisterWebsiteService";
import {ErrorMessage} from "../model/ErrorMessage";


@Component({
  selector: 'app-register-website',
  templateUrl: './register-website.component.html',
  styleUrls: ['./register-website.component.css']
})
export class RegisterWebsiteComponent implements OnInit {

  registerWebsite:WebsiteDetails= new WebsiteDetails();
  msg:string="";

  constructor(private  tokenStorage: TokenStorageService, private  registerWebsiteService:RegisterWebsiteService) { }

  ngOnInit(): void {
  }

  Submit(){
    this.registerWebsite.userId=this.tokenStorage.getUser().userId;
    this.registerWebsiteService.registerWebsite(this.registerWebsite).subscribe(data=>{
     //   let response= new Response();
      //  response= data as Response;
        this.msg= data as string;
        console.log("success");
        console.log(data);
    },
      error => {
      console.log("coming error");
      console.log(JSON.stringify(error.error));
        let errorObj= error.error as ErrorMessage;
        console.log(JSON.stringify(errorObj));
        this.msg=errorObj.customMessage;

      })
  }

}
