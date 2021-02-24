import { Injectable } from '@angular/core';
import { Students } from '../models/students';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app-constants';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private httpClient: HttpClient) { }
  public getStudents(pagingData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "Students/GetStudents"

    return this.httpClient.post
      (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public AEDStudents(pagingData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "Students/AEDStudents"

    return this.httpClient.post
      (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public GetStudentProfile(pagingData,studentId) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "Students/GetStudentProfile";
    let requestData=JSON.stringify({
      data:pagingData,
      stduentid:studentId
    });

    return this.httpClient.post
      (loginUrl, requestData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public GetExamWiseSubjectMarks(pagingData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var loginUrl: string = AppConstants.Api.AdminApp + "Students/GetExamWiseSubjectMarks"

    return this.httpClient.post
      (loginUrl, pagingData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public getDropdowns(jsonData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var Url: string = AppConstants.Api.AdminApp + "Students/GetExamWiseClassesDropdowns"

    return this.httpClient.post
      (Url, jsonData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public GetStudentClassWiseExamMarks(requestData, type) {
    // this.branchesJsonData.next(this.branches);
    
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    if (type == "MARKS") {
      var Url: string = AppConstants.Api.AdminApp + "Students/GetStudentClassWiseExamMarks"
    }
    else {
      var Url: string = AppConstants.Api.AdminApp + "Students/GetStudentClassWiseExamReports"
    }

    return this.httpClient.post
      (Url, requestData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public StudentProfilePicUpload(requestData) {
    // const headers = new HttpHeaders().set("Content-Type", 'multipart/form-data');

    const headers:HttpHeaders = new HttpHeaders();
    headers.append("Content-Type", 'multipart/form-data');
    headers.append("Redirect-On-Request-Failure", 'true');

    var Url: string = AppConstants.Api.AdminApp + "Upload/UploadStudentProfilePic"

    return this.httpClient.post
      (Url, requestData,
        {
          headers: headers, 
          // withCredentials: true,
          reportProgress: true, observe: 'events'
        }
      ).pipe(
        map((response: any) => {
          return response;
        }));
  }

  public SubmitStudentClassWiseExamMarks(requestData) {
    // this.branchesJsonData.next(this.branches);
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    var Url: string = AppConstants.Api.AdminApp + "Students/SubmitStudentClassWiseExamMarks"

    return this.httpClient.post
      (Url, requestData, { headers: headers, withCredentials: true }).pipe(
        map((response: any) => {
          return response;
        }));
  }

}
