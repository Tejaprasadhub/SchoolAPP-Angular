import { Injectable } from '@angular/core';
import { Classes } from '../models/classes';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClassesService {
    constructor(private httpClient: HttpClient) { }
    public getClasses(pagingData) {
        // this.classesJsonData.next(this.classes);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Classes/GetClasses"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
    public AEDClasses(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Classes/AEDClasses"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
}
