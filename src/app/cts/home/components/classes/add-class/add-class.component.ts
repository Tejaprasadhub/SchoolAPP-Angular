import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { Utility } from 'src/app/cts/shared/models/utility';
import { ClassesService } from 'src/app/cts/shared/services/classes.service';
import { Classes } from 'src/app/cts/shared/models/classes';
import { AppConstants } from 'src/app/cts/app-constants';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
  [x: string]: any;
  classId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addClassForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  sections: SelectItem[] = [];
  status: SelectItem[] = [];
  querytype:number;



  constructor(private ClassesService: ClassesService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
    this.sections = [
      { label: '1-section', value: 1 },
      { label: '2-sections', value: 2 },
      { label: '2-sections', value: 3 }

    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
  }

  ngOnInit(): void {
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.classId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Class";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Class";
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
    this.addClassForm = this.fb.group({
      'class': new FormControl('', { validators: [Validators.required] }),
      'section': new FormControl('', { validators: [Validators.required] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditClassDetails();
  }
  bindEditClassDetails() {

    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.classId.toString();
    //Get Classes API call
    this.ClassesService.getClasses(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addClassForm.setValue({
            'class': this.editData.name,
            'section': this.editData.noofsections,
            'status': this.editData.status

          })
        }
      });
      
    
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Class";
  }

  addClassSubmit(): void {
    // this.errorMessage = "";
    // this.successMessage = "";
    // this.formSubmitAttempt = true;
    // if (this.addClassForm.valid) {
    //   this.formSubmitAttempt = false;
    //   console.log(this.addClassForm.value);
    //   this.addClassForm.reset();
    //   this.successMessage = "Your changes have been successfully saved";
    // }

    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addClassForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Classes();

      customObj = this.addClassForm.value;
      debugger
      customObj.id = this.classId;
      customObj.querytype = this.querytype;
      customObj.name = customObj.class;

      //AED Branches API call
      this.ClassesService.AEDClasses(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addClassForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = "Class name already exists";
          }
        },
        error =>{  
          this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
        });
    }
  }

  resetForm(): void {
    this.addClassForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}


