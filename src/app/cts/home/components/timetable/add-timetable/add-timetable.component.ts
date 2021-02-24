import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Utility } from 'src/app/cts/shared/models/utility';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { TimetableService } from 'src/app/cts/shared/services/timetable.service';
import { AppConstants } from 'src/app/cts/app-constants';
import { Timetable } from 'src/app/cts/shared/models/timetable';

@Component({
  selector: 'app-add-timetable',
  templateUrl: './add-timetable.component.html',
  styleUrls: ['./add-timetable.component.scss']
})
export class AddTimetableComponent implements OnInit {
  timetableId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addTimetableForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  classid: any[];
  subjectid: any[];
  teacherid: any[];
  status: any[];
  querytype:number;


  constructor(private TimetableService: TimetableService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
    this.classid = [
      { label: 'class1', value: '1' },
      { label: 'class2', value: '2' },
      { label: 'class3', value: '3' }
    ];
    this.subjectid = [
      { label: 'subject1', value: '1' },
      { label: 'subject2', value: '2' },
      { label: 'subject3', value: '3' }
    ];
    this.teacherid = [
      { label: 'teacher1', value: '1' },
      { label: 'teacher2', value: '2' },
      { label: 'teacher3', value: '3' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
  }

  ngOnInit(): void {// On page load
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.timetableId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Timetable";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;

    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Timetable";
      this.editControls();
      this.fetchData();
      this.querytype=2;

    } else {
      this.pageTitle = "View Details";
      this.isDisabled = true;
      this.isRequired = false;
      this.fetchData();
      this.querytype=2;

    }

  }

  createForm() {
    this.addTimetableForm = this.fb.group({
      'classid': new FormControl('', { validators: [Validators.required] }),
      'subjectid': new FormControl('', { validators: [Validators.required] }),
      'teacherid': new FormControl('', { validators: [Validators.required] }),
      'periodfrom': new FormControl('', { validators: [Validators.required] }),
      'periodto': new FormControl('', { validators: [Validators.required] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditTimetableDetails();
  }
  bindEditTimetableDetails() {
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.timetableId.toString();
    //Get Branches API call
    this.TimetableService.getTimetable(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addTimetableForm.setValue({
            'classid': this.editData.class,
            'subjectid': this.editData.subject,
            'teacherid': this.editData.teacher,
            'periodfrom': new Date(this.editData.periodfrom),
            'periodto': new Date(this.editData.periodto),
            'status': this.editData.status

           
          })
        }
      });
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Timetable";
  }

  addTimetableSubmit(): void {
    // this.errorMessage = "";
    // this.successMessage = "";
    // this.formSubmitAttempt = true;
    // if (this.addTimetableForm.valid) {
    //   this.formSubmitAttempt = false;
    //   console.log(this.addTimetableForm.value);
    //   this.addTimetableForm.reset();
    //   this.successMessage = "Your changes have been successfully saved";
    // }
    
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addTimetableForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Timetable();
      customObj = this.addTimetableForm.value;
      customObj.id = this.timetableId;
      customObj.querytype = this.querytype;

      //AED Branches API call
      this.TimetableService.AEDTimetable(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addTimetableForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = "classid already exists";
          }
        },
        error =>{  
          this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
        });
    }
  }

  resetForm(): void {
    this.addTimetableForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}
