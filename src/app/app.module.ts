import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './dashboard/dashboard.component';
import {DashboardService} from "./service/dashboard.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatTabsModule} from "@angular/material/tabs";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import { LoginComponent } from './login/login.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AuthInterceptor, authInterceptorProviders} from "./authentication/AuthInterceptor";
import { SignupComponent } from './signup/signup.component';
import { RegisterWebsiteComponent } from './register-website/register-website.component';
import {AuthGuard} from "./authentication/AuthGuard";
import { UpdateWebsiteComponent } from './update-website/update-website.component';
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    RegisterWebsiteComponent,
    UpdateWebsiteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule



  ],
  providers: [DashboardService,authInterceptorProviders, AuthGuard,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
