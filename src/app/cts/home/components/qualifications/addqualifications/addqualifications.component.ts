import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { AppConstants } from 'src/app/cts/app-constants';
import { Qualifications } from 'src/app/cts/shared/models/qualifications';
import { QualificationsService } from 'src/app/cts/shared/services/qualifications.service';
import { Utility } from 'src/app/cts/shared/models/utility';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-addqualifications',
  templateUrl: './addqualifications.component.html',
  styleUrls: ['./addqualifications.component.scss']
})
export class AddQualificationComponent implements OnInit {
  qualificationId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addQualificationForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  querytype:number;
  status: SelectItem[] = [];


  
  constructor(private QualificationsService: QualificationsService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private location: Location) {
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
   }

  ngOnInit(): void {// On page load
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.qualificationId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Qualification";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Qualification";
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
    this.addQualificationForm = this.fb.group({
      'code': new FormControl('', { validators: [Validators.required] }),
      'title': new FormControl('', { validators: [Validators.required] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditQualificationDetails();
  }
  bindEditQualificationDetails() {
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.qualificationId.toString();
    //Get Classes API call
    this.QualificationsService.getQualifications(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addQualificationForm.setValue({
            'code': this.editData.code,
            'title': this.editData.title,
            'status': this.editData.status,


          })
        }
      });
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Qualification";
  }

  addQualificationSubmit(): void {
    // this.errorMessage = "";
    // this.successMessage = "";
    // this.formSubmitAttempt = true;
    // if (this.addQualificationForm.valid) {
    //   this.formSubmitAttempt = false;
    //   console.log(this.addQualificationForm.value);
    //   this.addQualificationForm.reset();
    //   this.successMessage = "Your changes have been successfully saved";
    // }

    
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addQualificationForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Qualifications();
      customObj = this.addQualificationForm.value;
      customObj.id = this.qualificationId;
      customObj.querytype = this.querytype;

      //AED Branches API call
      this.QualificationsService.AEDQualifications(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addQualificationForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = "Qualification code or title already exists";
          }
        },
          error =>{  
            this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
          });
    }
  }

  resetForm(): void {
    this.addQualificationForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}
