import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {AuthGuard} from "./authentication/AuthGuard";
import {RegisterWebsiteComponent} from "./register-website/register-website.component";
import {root} from "rxjs/internal-compatibility";
import {UpdateWebsiteComponent} from "./update-website/update-website.component";

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterWebsiteComponent, canActivate: [AuthGuard] },
  { path:'login', component: LoginComponent},
  { path:'signup', component: SignupComponent},
  { path:'update-website', component: UpdateWebsiteComponent},
  { path: ':anything', component: DashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
