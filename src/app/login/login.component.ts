import { Component, OnInit } from '@angular/core';
import {NgForm, Validators} from '@angular/forms';
import {User} from "../model/User";
import {AuthService} from "../service/AuthService";
import {UserStorageService} from "../service/user-storage.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";
import {ErrorMessage} from "../model/ErrorMessage";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:User= new User();
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  roles: string[] = [];
  constructor(private authService: AuthService, private tokenService:UserStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenService.getUser().userId) {
      this.isLoggedIn = true;
      this.roles = this.tokenService.getUser().roles;
      this.router.navigate(['/dashboard/']);
    }
  }

  Submit(loginForm: NgForm){
    if(loginForm.invalid) return;

    this.authService.login(this.user).pipe(first()).subscribe(data=>{

      this.router.navigate(['/dashboard/']);

    },
      error => {

        let errorObj= error.error as ErrorMessage;
        if(errorObj)
           this.errorMessage=errorObj.customMessage;
        else
          this.errorMessage="Some error occurred. please try again later."
        console.log(errorObj);
        console.log("coming error");

      });
  }

}
