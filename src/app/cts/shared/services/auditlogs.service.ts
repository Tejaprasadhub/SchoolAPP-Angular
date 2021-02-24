import { Injectable } from '@angular/core';
import { Auditlogs } from '../models/auditlogs';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuditlogsService {

  constructor(private httpClient: HttpClient) { }
  public getAuditlogs(pagingData) {
    // this.auditlogsJsonData.next(this.auditlogs);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "AuditLogs/GetAuditLogTables"

    return this.httpClient.post
      (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }
  public AuditlogTableDetails(pagingData) {
    // this.auditlogsJsonData.next(this.auditlogs);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "AuditLogs/AuditlogTableDetails"

    return this.httpClient.post
      (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

}
