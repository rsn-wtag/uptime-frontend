import { Component, OnInit } from '@angular/core';
import {User} from "../model/User";
import {AuthService} from "../service/AuthService";
import {Router} from "@angular/router";
import {UserStorageService} from "../service/user-storage.service";
import {first} from "rxjs/operators";
import {NgForm} from "@angular/forms";
import {ErrorMessage} from "../model/ErrorMessage";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:User=new User();
  errorMsg:String="";
  constructor(private  authService:AuthService, private tokenService: UserStorageService, private router:Router) { }

  ngOnInit(): void {
  }

  Submit(signup:NgForm){
    if (signup.invalid) return;
    this.authService.register(this.user).pipe(first()).subscribe(data=>{
      this.router.navigate(['/dashboard']);
    },error => {
      var errorObj= error.error as ErrorMessage;
      if(errorObj)
        this.errorMsg=errorObj.customMessage;
      else
      this.errorMsg="Unable to register Please try again";
    });
  }

}
