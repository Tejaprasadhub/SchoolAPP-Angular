import { Injectable } from '@angular/core';
import { Parents } from '../models/parents';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ParentsService {
    constructor(private httpClient: HttpClient) { }
    public getParents(pagingData) {
        // this.classesJsonData.next(this.classes);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Parents/GetParents"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
    public AEDParents(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Parents/AEDParents"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
}
