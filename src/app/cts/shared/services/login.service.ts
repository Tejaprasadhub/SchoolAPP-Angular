import{HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { SessionTimeoutService } from 'src/app/core/security/session-timeout.service';
import { AppConstants } from '../../app-constants';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public static Token:string;

  constructor(private httpClient : HttpClient,private sessionTimeOutService : SessionTimeoutService) { }

  submitUserAccessDetails(loginUserData){
    const headers = new HttpHeaders().set("Content-Type","application/json");
    let data=JSON.stringify({
      UserName:loginUserData.userName,
      Password:loginUserData.password
    });
    var  loginUrl:string = AppConstants.Api.security+"AccessToken/ValidateUser"

    return this.httpClient.post
    (loginUrl,data,{headers:headers,withCredentials:true}).pipe(
    map((response:any)=> {
      //login successful if there's a jwt token in the response
      var token =  response.token;
      if(token){
        //set token property
        LoginService.Token = token;
        var userInformationString = JSON.stringify({UserName:loginUserData.userName,token:token,userId:response.userId});

        //store username and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUser',userInformationString);

        this.sessionTimeOutService.startTimer(response.timeoutMinutes,response.warningMinutes);

        return response;
      }else{
        return response;
      }
    }),
    catchError(e => {
      if(e.status === 401){
        return "Invalid Credintials";
      }else{
        return "Unknown Credintials";
      }
    }));    
  }

  logout():void{
    LoginService.Token = null;
    this.sessionTimeOutService.cancelTimer();
  }

}
