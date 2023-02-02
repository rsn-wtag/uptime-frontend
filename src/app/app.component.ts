import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserStorageService} from "./service/user-storage.service";
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
  constructor(private router:Router, private userStorageService: UserStorageService,
              private authService:AuthService) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  editUser(){
    this.router.navigate(['/edit-user']);
  }
  logout() {
    this.authService.logout().subscribe(data=>{
      this.userStorageService.removeUserFromStorage();
      this.router.navigate(['/login']).then(()=>{
        window.location.reload();});
    });



  }
}
