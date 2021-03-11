import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/api/selectitem';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { Events } from 'src/app/cts/shared/models/achievements';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AchievementsService } from 'src/app/cts/shared/services/achievements.service';
import { AppConstants } from 'src/app/cts/app-constants';
import { InputPatternService } from 'src/app/cts/shared/services/input-pattern.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  eventId: number;
  formType: string;
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  addEventForm: FormGroup;
  formSubmitAttempt: boolean = false;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  editData: any;
  branchids: SelectItem[] = [];
  categories: SelectItem[] = [];
  registration: SelectItem[] = [];  
  status: SelectItem[] = [];
  querytype:number;


  
  constructor(private achievementService:AchievementsService,private dropdownService: DropdownService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private location: Location,private inputpattern:InputPatternService) {
   
    this.categories = [
      { label: 'major', value: 'MJR' },
      { label: 'minor', value: 'MNR' },
      { label: 'medium', value: 'MDM' }
    ];
    this.registration = [
      { label: 'yes', value: 'Y' },
      { label: 'no', value: 'N' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];

    var dropdowns = ["branches"];
    this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.branchids = result.data.branches;
        }
      });
   }

  ngOnInit(): void {// On page load
     //to read url parameters
   this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
    this.eventId = Number(window.atob(params['id']));
    this.formType = window.atob(params['type']);
  });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Event";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Event";
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
    this.addEventForm = this.fb.group({
      'name': new FormControl('', { validators: [Validators.required]}),
      'branchid': new FormControl('', { validators: [Validators.required] }),
      'category': new FormControl(''),
      'register': new FormControl('', { validators: [Validators.required] }),
      'startdate': new FormControl('', { validators: [Validators.required] }),
      'enddate': new FormControl(''),
      'status': new FormControl('', { validators: [Validators.required] }),
      'url': new FormControl(''),
      'description': new FormControl('')
    });
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditEventDetails();
  }
  bindEditEventDetails() {
    let customObj = new Events();
    customObj.id = Number(this.eventId.toString());
    customObj.querytype = 0;
    //Get Events API call
    this.achievementService.getEvents(customObj)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addEventForm.setValue({
            'name': this.editData.title,
            'branchid': this.editData.branch_id,
            'category': this.editData.category,
            'register': this.editData.accept_registrations,            
            'status': this.editData.status,
            'url': this.editData.url,
            'description': this.editData.description,
            'startdate': new Date(this.editData.start),
            'enddate': new Date(this.editData.end),
          })
        }
      }); 
  }

  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Event";
  }

  addEventSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addEventForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Events();
      customObj = this.addEventForm.value;
      customObj.id = this.eventId;
      customObj.querytype = this.querytype;
      customObj.start=this.getServerSideDateFormat(this.addEventForm.value['startdate']);
      customObj.end=this.getServerSideDateFormat(this.addEventForm.value['enddate']) == "" ? this.getServerSideDateFormat(this.addEventForm.value['startdate']) : this.getServerSideDateFormat(this.addEventForm.value['enddate']);

      //AED Events API call
      this.achievementService.AEDEvents(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {   
            if (this.formType == "create") {
            this.addEventForm.reset();
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

  getServerSideDateFormat(date): string {
    if(date != null && date != ""){
      return moment(date).format(Paginationutil.getServerSideDateFormat())
    }else{
      return "";
    }
  }

  resetForm(): void {
    this.addEventForm.reset();
    this.successMessage = "";
  }

  list(): void {
    this.location.back();
  }

  keyPressAlphabet(event)
  {
     this.inputpattern.Alphabet(event);
  }
}
