import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Utility } from 'src/app/cts/shared/models/utility';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { AchievementsService } from 'src/app/cts/shared/services/achievements.service';
import { AppConstants } from 'src/app/cts/app-constants';
import { Achievements } from 'src/app/cts/shared/models/achievements';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';

@Component({
  selector: 'app-add-achievement',
  templateUrl: './add-achievement.component.html',
  styleUrls: ['./add-achievement.component.scss']
})
export class AddAchievementComponent implements OnInit {
  achievementId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addAchievementForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  branches:any;
  status:any;
  querytype:number;


  constructor(private dropdownService: DropdownService,private AchievementsService: AchievementsService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
      //Get Dropdowns API call
      var dropdowns = ["branches"];
      this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
         this.branches = result.data.branches;     
        }
      });  
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
   }

  ngOnInit(): void {// On page load
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.achievementId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Achievement";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;

    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Achievement";
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
    this.addAchievementForm = this.fb.group({
      'title': new FormControl('', { validators: [Validators.required, Validators.pattern('^([A-Za-z0-9 _\'-])*$')] }),
      'date': new FormControl('', { validators: [Validators.required] }),
      'branchid':new FormControl('', { validators: [Validators.required] }),
      'status': new FormControl('', { validators: [Validators.required] })

    });
  }

  private fetchData() {
    // this.loadGender(this.gender); 
    this.bindEditAchievementDetails();
  }
  bindEditAchievementDetails() {
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.achievementId.toString();
    //Get Branches API call
    this.AchievementsService.getAchievements(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addAchievementForm.setValue({
            'title': this.editData.title,
            'date': new Date(this.editData.date),
            'branchid': this.editData.branch,
            'status':this.editData.status

          })
        }
      });
  }







  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Achievement";
  }

  addAchievementSubmit(): void {   
    
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addAchievementForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Achievements();
      customObj = this.addAchievementForm.value;
      customObj.id = this.achievementId;
      customObj.querytype = this.querytype;

      //AED Branches API call
      this.AchievementsService.AEDAchievements(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addAchievementForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = AppConstants.Messages.errorMessage;
          }
        });
    }
  }

  resetForm(): void {
    this.addAchievementForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

}
