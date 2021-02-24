import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Utility } from 'src/app/cts/shared/models/utility';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { NewsService } from 'src/app/cts/shared/services/news.service';
import { News } from 'src/app/cts/shared/models/news';
import { AppConstants } from 'src/app/cts/app-constants';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {
  newsId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addNewsForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  branchids: SelectItem[] = [];
  status: SelectItem[] = [];
  querytype:number;



  constructor(private NewsService: NewsService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
    this.branchids = [
      { label: 'skota', value: '1' },
      { label: 'boddam', value: '2' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
  }

  ngOnInit(): void {
   //to read url parameters
   this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
    this.newsId = Number(window.atob(params['id']));
    this.formType = window.atob(params['type']);
  });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add News";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit News";
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
    this.addNewsForm = this.fb.group({
      'title': new FormControl('', { validators: [Validators.required] }),
      'branchid': new FormControl('', { validators: [Validators.required] }),
      'date': new FormControl('', { validators: [Validators.required] }),
      'description': new FormControl('', { validators: [Validators.required] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditNewsDetails();
  }
  bindEditNewsDetails() {
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.newsId.toString();
    //Get Branches API call
    this.NewsService.getNews(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addNewsForm.setValue({
            'title': this.editData.title,
            'date': new Date(this.editData.date),
            'description': this.editData.description,
            'branchid': this.editData.branch,
            'status': this.editData.status
          })
        }
      }); 
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit News";
  }

  addNewsSubmit(): void {
    // this.errorMessage = "";
    // this.successMessage = "";
    // this.formSubmitAttempt = true;
    // if (this.addNewsForm.valid) {
    //   this.formSubmitAttempt = false;
    //   console.log(this.addNewsForm.value);
    //   this.addNewsForm.reset();
    //   this.successMessage = "Your changes have been successfully saved";
    // }
    
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addNewsForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new News();
      customObj = this.addNewsForm.value;
      customObj.id = this.newsId;
      customObj.querytype = this.querytype;

      //AED Branches API call
      this.NewsService.AEDNews(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addNewsForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = "News title already exists";
          }
        },
        error =>{  
          this.router.navigate(['/admin/app-error'], {  queryParams: { message: window.btoa(error.message)} });     
        });
    }
  }

  resetForm(): void {
    this.addNewsForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

} 


