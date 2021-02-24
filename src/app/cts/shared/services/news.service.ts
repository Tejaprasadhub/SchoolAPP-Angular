import { Injectable } from '@angular/core';
import { News } from '../models/news';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    constructor(private httpClient: HttpClient) { }
    public getNews(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "News/GetNews"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
    public AEDNews(pagingData) {
        // this.branchesJsonData.next(this.branches);
        const headers = new HttpHeaders().set("Content-Type", "application/json");

        var loginUrl: string = AppConstants.Api.AdminApp + "News/AEDNews"

        return this.httpClient.post
            (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
                map((response: any) => {
                    return response;
                }));
    }
}

