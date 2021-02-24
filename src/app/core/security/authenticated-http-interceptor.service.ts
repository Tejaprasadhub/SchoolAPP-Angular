import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalstoragetokenService } from './localstoragetoken.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SessionTimeoutService } from './session-timeout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedHttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router, public TokenProvider: LocalstoragetokenService,public sessionTimeoutService:SessionTimeoutService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    if(req.url.endsWith('AccessToken/') || req.url.endsWith('AccessToken/ValidateUser')){
      let headers = req.headers.set('Content-Type','application/json');
      const clone = req.clone({headers:headers})
      return next.handle(req);
    }


    let token = this.TokenProvider.getToken();

    if (token == "" || token== null) {
      var currentUser = JSON.parse(this.TokenProvider.getToken());
      token = currentUser && currentUser.token;
    }

    let errorRedirectPage = "/admin/app-error";

    let headers = null;
    if(req.headers.has('Content-Type') == false && req.headers.has('No-Content-Type') == false
    && req.url.indexOf('Upload/UploadStudentProfilePic') < 0){
      headers = req.headers.set('Authorization',`Bearer ${token}`).set('Content-Type','application/json');
    }else{
      headers = req.headers.set('Authorization',`Bearer ${token}`);
    }

    const clone = req.clone({headers : headers});

    return next.handle(clone).pipe(tap((event : HttpEvent<any>)=>{

      if(event instanceof HttpResponse){
        let isLogout = req.url.indexOf('logout') >= 0;
        if(event.status == 200 && isLogout == false){
          this.sessionTimeoutService.resetTimer();          
        }
        else if(event.status != 204){
          if(req.headers.has('Redirect-On-Request-Failure')){
            this.router.navigate([errorRedirectPage],{
              queryParams:{
                message:event.body ? event.body.message : ""
              }
            })
          }
        }
      }
      
    },(err:any) => {
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.sessionTimeoutService.cancelTimer();
          this.router.navigateByUrl('/login');          
        }else{
          if(req.headers.has('Redirect-On-Request-Failure')){
            this.router.navigate([errorRedirectPage],{
              queryParams:{
                message:err.error.message
              }
            })
          }
        }
      }else if(req.headers.has('Redirect-On-Request-Failure')){
        this.router.navigate([errorRedirectPage],{
          queryParams:{
            message:""
          }
        });
      }
    }));
  }
}
