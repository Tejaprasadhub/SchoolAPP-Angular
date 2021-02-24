import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { AppConstants } from "../../app-constants";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class RoleAccessService {
  constructor(private httpClient: HttpClient) {}

  UserFeatures(id) {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string =
      AppConstants.Api.AdminApp + "RoleAccess/UserFeatures";

    return this.httpClient
      .post(loginUrl,id, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public AEDRoleAccess(pagingData,ID) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "RoleAccess/AEDRoleAccess";
    let data=JSON.stringify({
      listData:pagingData,
      id:ID
    });

    return this.httpClient
      .post(loginUrl, data, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
