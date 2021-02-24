import { Injectable } from '@angular/core';
import { Studentreports } from '../models/studentreports';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentreportsService {
  public teachers: Studentreports[]= 
  [
    {
      "id": 1,     
      "subject": "Telugu",
      "marksobtained": 45,
      "totalmarks": 50,
      "status": "Pass"   
    },
    {
      "id": 1,     
      "subject": "Hindi",
      "marksobtained": 35,
      "totalmarks": 50,
      "status": "Pass"   
    },
    {
      "id": 1,     
      "subject": "English",
      "marksobtained": 10,
      "totalmarks": 50,
      "status": "Fail"   
    },
    {
      "id": 1,     
      "subject": "Mathematics",
      "marksobtained": 48,
      "totalmarks": 50,
      "status": "Pass"   
    },
    {
      "id": 1,     
      "subject": "Science",
      "marksobtained": 35,
      "totalmarks": 50,
      "status": "Pass"   
    },
    {
      "id": 1,     
      "subject": "Social",
      "marksobtained": 45,
      "totalmarks": 50,
      "status": "Pass"   
    }
  ];
  private studentreportsJsonData = new BehaviorSubject<any>(null);
  public studentreportsJson = this.studentreportsJsonData.asObservable();

  constructor() { }
  public  getStudentreports() {    
    this.studentreportsJsonData.next(this.teachers);
    }
}
