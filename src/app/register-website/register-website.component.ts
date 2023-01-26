import { Component, OnInit } from '@angular/core';
import {WebsiteDetails} from "../model/WebsiteDetails";
import {TokenStorageService} from "../service/TokenStorageService";
import {RegisterWebsiteService} from "../service/RegisterWebsiteService";
import {ErrorMessage} from "../model/ErrorMessage";
import {NgForm} from "@angular/forms";


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

  Submit(register:NgForm){
    if(register.invalid) return;
    this.registerWebsite.userId=this.tokenStorage.getUser().userId;
    this.registerWebsiteService.registerWebsite(this.registerWebsite).subscribe(data=>{
     //   let response= new Response();
      //  response= data as Response;
        this.msg="Website Registered successfully";
        console.log("success");

    },
      error => {
      console.log("coming error");
      console.log(JSON.stringify(error.error));
        let errorObj= error.error as ErrorMessage;
        console.log(JSON.stringify(errorObj));
        this.msg=errorObj.customMessage;

      });
  }

}
