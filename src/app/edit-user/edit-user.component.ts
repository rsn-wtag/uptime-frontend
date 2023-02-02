import { Component, OnInit } from '@angular/core';
import {User} from "../model/User";
import {NgForm} from "@angular/forms";
import {UserService} from "../service/user.service";
import {ErrorMessage} from "../model/ErrorMessage";
import {UserStorageService} from "../service/user-storage.service";
import {AuthService} from "../service/AuthService";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user:User;
  msg:String;
  constructor(private userService:UserService, private userStorageService:UserStorageService, private authService:AuthService) {
    this.user=this.userStorageService.getUser();
  }

  ngOnInit(): void {
  }

  Submit(updateUser:NgForm){
    if(updateUser.invalid) return;
    if( !updateUser.dirty) {
      this.msg='Please update some fields.';
      return;
    }
      this.userService.editUser(this.user).subscribe(data=>{
          this.msg="User updated successfully";
          const user= data.body;
         // @ts-ignore
          this.authService.saveUser(user);
      },
        error => {

          let errorObj= error.error as ErrorMessage;
          if(errorObj)
            this.msg=errorObj.customMessage;
          else
            this.msg="Some error occurred. please try again later."
          console.log(errorObj);
          console.log("coming error");
        });
  }

}
