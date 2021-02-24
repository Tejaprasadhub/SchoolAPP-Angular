import { Injectable } from '@angular/core';
import { Qualifications } from '../models/qualifications';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class QualificationsService {  

    constructor(private httpClient: HttpClient) { }
    public getQualifications(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Qualifications/GetQualifications"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
    public AEDQualifications(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Qualifications/AEDQualifications"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }   
}
