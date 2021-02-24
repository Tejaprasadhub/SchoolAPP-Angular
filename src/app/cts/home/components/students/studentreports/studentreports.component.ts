import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { StudentreportsService } from 'src/app/cts/shared/services/studentreports.service';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Studentreports } from 'src/app/cts/shared/models/studentreports';
import { StudentsService } from 'src/app/cts/shared/services/students.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-studentreports',
  templateUrl: './studentreports.component.html',
  styleUrls: ['./studentreports.component.scss']
})
export class StudentreportsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  studentreports: Studentreports[];
  classes: any;
  exams: any;
  cols: any[];
  datasource: Studentreports[];
  totalRecords: number;
  loading: boolean;
  studentID: any;
  classID:any = 0;  
  errorMessage: string = "";
  successMessage: string = "";  
  classDropDownValue: any;
  examDropDownValue: any;
  reportsData:any;
  subjects:any[]=[];
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private studentreportsService: StudentreportsService,private studentsService: StudentsService) {
    

   }

  ngOnInit(): void {   
    this.cols = [
      { field: 'subject', header: 'Subject' },
      { field: 'obtained', header: 'Marks Obtained' },
      { field: 'cutoff', header: 'Cut Off' },
      { field: 'total', header: 'Total Marks' },
      { field: 'status', header: 'Status' }
    ];    
    this.loading = true;

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {     
      this.studentID = window.atob(params['id']);      
    });

     //Get Dropdowns API call
     let jsonData = JSON.stringify({
      dropdownfor :"classes",
      id: this.studentID,
      classid:this.classID
    })
    this.studentsService.getDropdowns(jsonData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.classes = result.data.classes;
        }
      });
  }

  classesdropdownChange(event): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.classDropDownValue = event.value;
     //Get Dropdowns API call
     let jsonData = JSON.stringify({
      dropdownfor :"exams",
      id: this.studentID,
      classid:this.classDropDownValue 
    })
    this.studentsService.getDropdowns(jsonData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.exams = result.data.exams;
        }
      });
    this.GetStudentClassWiseExamMarks(this.classDropDownValue, this.examDropDownValue);
  }
  examsdropdownChange(event): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.examDropDownValue = event.value;
    this.GetStudentClassWiseExamMarks(this.classDropDownValue, this.examDropDownValue);
  }
  GetStudentClassWiseExamMarks(classvalue, examvalue) {
    if (classvalue > 0 && examvalue > 0) {
      let jsonData = JSON.stringify({
        classid: classvalue,
        examid: examvalue,
        id: this.studentID,
        type:"REPTS"
      })
      this.studentsService.GetStudentClassWiseExamMarks(jsonData,"REPTS")
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {         
           this.reportsData = result.data[0];
           this.subjects = result.data[0].subjects;
          }
        });
    }
  }
}
