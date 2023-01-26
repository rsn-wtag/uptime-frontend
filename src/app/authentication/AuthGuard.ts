import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import {TokenStorageService} from "../service/TokenStorageService";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser = this.tokenStorageService.getUser();
    console.log("comong guard..."+currentUser);
    if (currentUser.userId) {
      // authorised so return true
      return true;
    }
    console.log("comong guard...");
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login/']);
    return false;
  }
}
