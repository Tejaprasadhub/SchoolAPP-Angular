import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';



export const AUTHZ_SERVICE = new InjectionToken<AuthorizationServiceBase>('authorization.service');

export abstract class AuthorizationServiceBase {
abstract authorizeRouteAccess(route:string):Observable<AuthorizationResult>;
}

export class AuthorizationResult{
  status:string;
  featureOptions:any[];
}

export enum DenialReason{
  SessionExpired = 0,
  TwoFactorAuthenticationNotCompleted,
  PasswordUpdateRequired,
  NotMatchingComponentForUrl,
  UserDeniedAccessToUrl
}

