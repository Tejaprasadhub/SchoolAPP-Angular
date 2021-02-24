import { Injectable } from '@angular/core';
import { Timetable } from '../models/timetable';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TimetableService { 

    constructor(private httpClient: HttpClient) { }
    public getTimetable(pagingData) {
        // this.timetableJsonData.next(this.timetable);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Timetable/GetTimetable"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }

    public AEDTimetable(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "Timetable/AEDTimetable"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
    
}
