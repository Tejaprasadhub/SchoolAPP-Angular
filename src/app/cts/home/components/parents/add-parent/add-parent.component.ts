import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { Utility } from 'src/app/cts/shared/models/utility';
import { ParentsService } from 'src/app/cts/shared/services/parents.service';
import { Parents } from 'src/app/cts/shared/models/parents';
import { AppConstants } from 'src/app/cts/app-constants';

@Component({
  selector: 'app-add-parent',
  templateUrl: './add-parent.component.html',
  styleUrls: ['./add-parent.component.scss']
})
export class AddParentComponent implements OnInit {
  [x: string]: any;
  parentId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addParentForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  gender: SelectItem[] = [];
  status: SelectItem[] = [];
  querytype:number;



  constructor(private ParentsService: ParentsService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
    this.gender = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }     

    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
  }

  ngOnInit(): void {
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.parentId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Parent";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Parent";
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
    this.addParentForm = this.fb.group({
      'fname': new FormControl('', { validators: [Validators.required] }),
      'lname': new FormControl('', { validators: [Validators.required] }),
      'mobile': new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]\\d{9}')] }),      'gender': new FormControl('',{ validators: [Validators.required] }),
      'email': new FormControl('', { validators: [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditParentDetails();
  }
  bindEditParentDetails() {

    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.parentId.toString();
    //Get Classes API call
    this.ParentsService.getParents(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addParentForm.setValue({
            'fname': this.editData.fname,
            'lname': this.editData.lname,
            'mobile': this.editData.mobile,
            'gender': this.editData.gender,
            'email': this.editData.email,
            'status': this.editData.status,


            
          })
        }
      });
      
    
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Parent";
  }

  addParentSubmit(): void {
    // this.errorMessage = "";
    // this.successMessage = "";
    // this.formSubmitAttempt = true;
    // if (this.addParentForm.valid) {
    //   this.formSubmitAttempt = false;
    //   console.log(this.addParentForm.value);
    //   this.addParentForm.reset();
    //   this.successMessage = "Your changes have been successfully saved";
    // }

    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addParentForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Parents();
      customObj = this.addParentForm.value;
      customObj.id = this.parentId;
      customObj.querytype = this.querytype;

      //AED Branches API call
      this.ParentsService.AEDParents(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addParentForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = "Parent already exists";
          }
        },
        error =>{  
          this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
        });
    }
  }

  resetForm(): void {
    this.addParentForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}


