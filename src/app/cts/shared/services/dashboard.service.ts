import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { AppConstants } from '../../app-constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }
  public getDashBoard(reqObj) {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      var loginUrl: string = AppConstants.Api.AdminApp + "Dashboard/GetDashboard"
      return this.httpClient.post
          (loginUrl, reqObj, { headers: headers, withCredentials: true }).pipe(
              map((response: any) => {
                  return response;
              }));
  }
}
