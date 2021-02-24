import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentsService } from 'src/app/cts/shared/services/students.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { examclasswisesubjectmarks } from 'src/app/cts/shared/models/exams';
import { AppConstants } from 'src/app/cts/app-constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-studentmarks',
  templateUrl: './studentmarks.component.html',
  styleUrls: ['./studentmarks.component.scss']
})
export class StudentmarksComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  classes: any;
  exams: any;
  radioButtonValue: string;
  disabled: boolean = true;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = true;
  isRequired: boolean = true;
  errorMessage: string = "";
  successMessage: string = "";
  classDropDownValue: any;
  examDropDownValue: any;
  studentID: any;
  classID:any = 0;
  formObj: any;
  validateForm:boolean = false;
  name = 'Angular';
  fields: any[];

  dynamicForm: FormGroup;
  constructor(private studentsService: StudentsService,private route: ActivatedRoute) {    
   
  }
  ngOnInit(): void {
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
    this.radioButtonValue = 'P';
  }

  editControls(): void {
    this.isDisabled = false;
  }

  onSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    let marksArray=[];
    if (this.dynamicForm.valid) {
      this.formSubmitAttempt = false;    
       for(let object of this.fields){
        var key = object.label;
        var formObject = this.dynamicForm.value;
        let customObj = new examclasswisesubjectmarks();
        customObj.classId = this.classDropDownValue;
        customObj.examId = this.examDropDownValue;
        customObj.studentId=this.studentID;
        customObj.subjectId =object.id;
        customObj.marks = formObject[key];
        marksArray.push(customObj);
      }
      this.studentsService.SubmitStudentClassWiseExamMarks(marksArray)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.successMessage = AppConstants.Messages.successMessage;
        }else{
          this.errorMessage = AppConstants.Messages.errorMessage;
        }
      });
    }
  }
   
  resetForm(): void {
    this.dynamicForm.reset();
    this.successMessage = "";
    this.errorMessage = "";
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
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
    this.validateForm = false;
    if (classvalue > 0 && examvalue > 0) {
      let jsonData = JSON.stringify({
        classid: classvalue,
        examid: examvalue,
        id: this.studentID,        
        type:"MARKS"
      })
      this.studentsService.GetStudentClassWiseExamMarks(jsonData,"MARKS")
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            
            if(result.data.length > 0){
              this.validateForm= true;
            this.fields = result.data;
            const controls = {};
            this.fields.forEach(res => {
              const validationsArray = [];
              validationsArray.push(
                Validators.required
              );

              controls[res.label] = new FormControl('', validationsArray);
            });
            this.dynamicForm = new FormGroup(
              controls
            );
            var object = {};
            this.fields.forEach(function (value) {
              object[value.label] = value.securedMarks;
            });
            this.dynamicForm.setValue(object)
          }

          }
        });
    }
  }


}
