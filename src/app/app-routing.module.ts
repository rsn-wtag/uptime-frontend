import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {AuthGuard} from "./authentication/AuthGuard";
import {RegisterWebsiteComponent} from "./register-website/register-website.component";
import {UpdateWebsiteComponent} from "./update-website/update-website.component";
import {EditUserComponent} from "./edit-user/edit-user.component";

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterWebsiteComponent, canActivate: [AuthGuard] },
  { path:'login', component: LoginComponent},
  { path:'signup', component: SignupComponent},
  { path:'update-website', component: UpdateWebsiteComponent},
  { path: 'edit-user', component: EditUserComponent, canActivate: [AuthGuard]},
  { path: ':anything', component: DashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
