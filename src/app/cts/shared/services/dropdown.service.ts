import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private httpClient: HttpClient) { }
  public getDropdowns(requestData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var Url: string = AppConstants.Api.AdminApp + "Dropdown/GetDropdowns"

    return this.httpClient.post
      (Url, requestData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public getMenuOptions() {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var Url: string = AppConstants.Api.AdminApp + "Dropdown/GetMenuOptions"

    return this.httpClient.post
      (Url, "", { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }
}
