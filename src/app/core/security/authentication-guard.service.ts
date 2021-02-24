import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { LoginService } from 'src/app/cts/shared/services/login.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate,CanActivateChild,CanLoad {
  private ngUnsubscribe = new Subject();
  constructor(private router:Router,private loginService:LoginService) { }

  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean{
    let url:string = state.url
    return this.checkLogin(url);
  }

  canActivateChild(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean{
    return this.canActivate(route,state);
  }

  canLoad(route:Route):boolean{
    let url=`/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url:string):boolean{
    var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    var token = currentUser && currentUser.token;

    if(token != null && token != ""){
      //  let decoded = JwtHelper.decodeToken(token);
      //  let userProfile = JSON.parse(decoded.UserProfile)
      //  let loginUserData={
      //   userName:userProfile.UserName,
      //   password:userProfile.Password 
      // };
      // this.loginService.submitUserAccessDetails(loginUserData)
      // .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      //   if(result.status){
      //     return true;
      //   }else{
      //     //not logged in so redirect to login page
      // this.router.navigate(['/login']);      
      // return false
      //   }
      // })
      //logged in so return true
      return true
    }else{
      //not logged in so redirect to login page
      this.router.navigate(['/login']);      
      return false
    }
  }

}

class JwtHelper{
  private static urlBase64Decode(str: string){
    var output = str.replace(/-/g,'+').replace(/_/g,'/');
    switch(output.length % 4){
      case 0:{break;}
      case 2:{output += '=='; break;}
      case 3:{output += '='; break;}
      default:{
        throw 'Illegal base64url string!'
      }
    }
    return decodeURIComponent(encodeURI(window.atob(output)));
  }

  public static decodeToken(token: string){
    var parts=token.split('.');
    if(parts.length !== 3){
      throw new Error('Jwt must have 3 parts');
    }
    var decoded = this.urlBase64Decode(parts[1]);
    if(!decoded){
      throw new Error('cannot decode the token');
    }
    return JSON.parse(decoded);
  }
}
