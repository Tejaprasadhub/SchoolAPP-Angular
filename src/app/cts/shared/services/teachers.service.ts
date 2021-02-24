import { Injectable } from '@angular/core';
import { Teachers } from '../models/teachers';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  constructor(private httpClient: HttpClient) { }
  public getTeachers(pagingData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var Url: string = AppConstants.Api.AdminApp + "Teachers/GetTeachers"

    return this.httpClient.post
      (Url, pagingData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public AEDTeachers(pagingData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "Teachers/AEDTeachers"

    return this.httpClient.post
        (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
            map((response: any) => {
                return response;
            }));
}
}
