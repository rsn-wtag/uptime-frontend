import { Component, OnInit } from '@angular/core';
import {WebsiteDetails} from "../model/WebsiteDetails";
import {UserStorageService} from "../service/user-storage.service";
import {ErrorMessage} from "../model/ErrorMessage";
import {NgForm} from "@angular/forms";
import {HttpStatusCode} from "@angular/common/http";
import {UnprocessableEntityErrorMessage} from "../model/UnprocessableEntityErrorMessage";
import {ErrorMessageHandler} from "../error-handler/ErrorMessageHandler";
import {WebsiteService} from "../service/website.service";


@Component({
  selector: 'app-register-website',
  templateUrl: './register-website.component.html',
  styleUrls: ['./register-website.component.css']
})
export class RegisterWebsiteComponent implements OnInit {

  registerWebsite:WebsiteDetails= new WebsiteDetails();
  msg:String="";

  errorMessageHandler:ErrorMessageHandler= new ErrorMessageHandler();
  constructor(private  tokenStorage: UserStorageService, private  websiteService:WebsiteService) { }

  ngOnInit(): void {
  }

  Submit(register:NgForm){
    if(register.invalid) return;

    /*console.log(register.control.get("url"));
    return;*/
    this.registerWebsite.userId=this.tokenStorage.getUser().userId;
    this.websiteService.registerWebsite(this.registerWebsite).subscribe(data=>{
     //   let response= new Response();
      //  response= data as Response;
        this.msg="Website Registered successfully";
        console.log("success");

    },
      error => {
      //console.log("coming error");
      //console.log(JSON.stringify(error.error));

        if(error.status==HttpStatusCode.UnprocessableEntity){
          console.log(error.error);
          let unprocError= error.error as UnprocessableEntityErrorMessage;
          this.msg=this.errorMessageHandler.handleUnprocessableEntityError(unprocError,register.control);
        }else{
          let errorObj= error.error as ErrorMessage;
          this.msg=errorObj.customMessage;
        }
      });
  }



}
