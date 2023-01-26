import { Component, OnInit } from '@angular/core';
import {User} from "../model/User";
import {AuthService} from "../service/AuthService";
import {using} from "rxjs";
import {Router} from "@angular/router";
import {JwtResponse} from "../model/JwtResponse";
import {TokenStorageService} from "../service/TokenStorageService";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:User=new User();
  errorMsg:String="";
  constructor(private  authService:AuthService, private tokenService: TokenStorageService,private router:Router) { }

  ngOnInit(): void {
  }

  Submit(){
    this.authService.register(this.user).pipe(first()).subscribe(data=>{
      this.router.navigate(['/dashboard']);
    },error => {
      this.errorMsg="Unable to register Please try again";
    });
  }

}
