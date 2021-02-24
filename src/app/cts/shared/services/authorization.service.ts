import { Injectable } from '@angular/core';
import { AuthorizationServiceBase, AuthorizationResult } from 'src/app/core/security/authorization.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthorizationService extends AuthorizationServiceBase {

  constructor(private httpClient: HttpClient) {
    super();
   }

   authorizeRouteAccess(route:string): Observable<AuthorizationResult>{
     const url= AppConstants.Api.AdminApp + 'Users/authorizeroute/';
     return this.httpClient.post(url,{routeUrl:route}).pipe(
       map((response:AuthorizationResult) => {
         return response;
       })
     )
   }
}
