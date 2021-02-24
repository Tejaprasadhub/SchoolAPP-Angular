import { CanActivate, CanActivateChild, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AUTHZ_SERVICE, AuthorizationServiceBase } from './authorization.service';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route } from '@angular/compiler/src/core';
import { LoginService } from 'src/app/cts/shared/services/login.service';
import { forEach } from 'angular';
@Injectable()
export class AuthorizationGuard  implements CanActivate, CanActivateChild,CanLoad {
   
     permissions: any[] = [];
     static permissionsOnComponent :any[]=[];
    
    constructor(private loginService:LoginService,private router:Router,private httpClient:HttpClient,@Inject(AUTHZ_SERVICE) private authorizationService:AuthorizationServiceBase){}

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<boolean> | boolean{
        
        return this.authorizationService.authorizeRouteAccess(state.url).pipe(
            map(result =>{
                if(result.status == 'true'){
                    this.permissions = result.featureOptions;
                    for(let permission of this.permissions){
                        AuthorizationGuard.permissionsOnComponent.push(permission)
                    }
                    return true;
                }else{
                    if(state.url != '/admin/dashboard')
                    // this.loginService.logout();
                    this.router.navigate(['/admin/access-denied']);     

                    else
                    this.permissions = result.featureOptions;
                    for(let permission of this.permissions){
                        AuthorizationGuard.permissionsOnComponent.push(permission)
                    }
                    return true;
                }  
            })
        )
    }

    canActivateChild(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean> | boolean{
        return this.canActivate(route,state);
    }
    canLoad(route:Route):boolean{
        return false;
    }

    static checkPermission(permissionValue){
        var data = AuthorizationGuard.permissionsOnComponent.filter((x) => x.title.includes(permissionValue))
        if(data.length > 0)
        return true
        else
        return false
    }
}
