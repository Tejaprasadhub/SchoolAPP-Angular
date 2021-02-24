import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { SubjectsService } from 'src/app/cts/shared/services/subjects.service';
import { Utility } from 'src/app/cts/shared/models/utility';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { AppConstants } from 'src/app/cts/app-constants';
import { Subjects } from 'src/app/cts/shared/models/subjects';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.scss']
})
export class AddSubjectsComponent implements OnInit {

  subjectId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addSubjectForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  querytype:number;
  status: SelectItem[] = [];

  
  constructor(private SubjectsService: SubjectsService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private location: Location) {
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
   }

  ngOnInit(): void {// On page load
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.subjectId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Subject";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Subject";
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
    this.addSubjectForm = this.fb.group({
      'code': new FormControl('', { validators: [Validators.required] }),
      'name': new FormControl('', { validators: [Validators.required] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditSubjectDetails();
  }
  bindEditSubjectDetails() {
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.subjectId.toString();
    //Get Branches API call
    this.SubjectsService.getSubjects(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addSubjectForm.setValue({
            'code': this.editData.code,
            'name': this.editData.name,
            'status': this.editData.status

          })
        }
      });
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Subject";
  }

  addSubjectSubmit(): void {
    // this.errorMessage = "";
    // this.successMessage = "";
    // this.formSubmitAttempt = true;
    // if (this.addSubjectForm.valid) {
    //   this.formSubmitAttempt = false;
    //   console.log(this.addSubjectForm.value);
    //   this.addSubjectForm.reset();
    //   this.successMessage = "Your changes have been successfully saved";
    // }
    
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addSubjectForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Subjects();
      customObj = this.addSubjectForm.value;
      customObj.id = this.subjectId;
      customObj.querytype = this.querytype;

      //AED Branches API call
      this.SubjectsService.AEDSubjects(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addSubjectForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = "Subject code or name already exists";
          }
        },
        error =>{  
          this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
        });
    }
  }

  resetForm(): void {
    this.addSubjectForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}


