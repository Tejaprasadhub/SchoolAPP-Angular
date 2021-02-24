import { Injectable } from '@angular/core';
import { Users } from '../models/users';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) { }
  public getUsers(pagingData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "Users/GetUsers"

    return this.httpClient.post
        (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
            map((response: any) => {
                return response;
            }));
}
public AEDUsers(pagingData) {
  // this.branchesJsonData.next(this.branches);
  const headers = new HttpHeaders().set("Content-Type", "application/json");

  var loginUrl: string = AppConstants.Api.AdminApp + "Users/AEDUsers"

  return this.httpClient.post
      (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
          map((response: any) => {
              return response;
          }));
}
}

