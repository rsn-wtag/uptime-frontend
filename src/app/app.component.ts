import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "./service/TokenStorageService";
import {User} from "./model/User";
import {AuthService} from "./service/AuthService";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'uptime-frontend';

  currentUser:User;
  constructor(private  router:Router, private tokenStorage: TokenStorageService,
              private authService:AuthService) {
    console.log("coming......"+this.tokenStorage.getUser());
    this.authService.currentUser.subscribe(x => this.currentUser = x);

  }

  logout() {
    this.authService.logout().subscribe(data=>{
      this.tokenStorage.logout();
      this.router.navigate(['/login']).then(()=>{
        window.location.reload();});
    });



  }
}
