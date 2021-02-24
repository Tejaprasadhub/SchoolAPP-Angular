import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { Students } from 'src/app/cts/shared/models/students';
import * as moment from 'moment';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { StudentsService } from 'src/app/cts/shared/services/students.service';
import { AppConstants } from 'src/app/cts/app-constants';
import { Utility } from 'src/app/cts/shared/models/utility';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  pageTitle: string;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();
  studentId: string;
  formType: string;
  editData: any;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  addStudentForm: FormGroup;
  formSubmitAttempt: boolean = false;
  branches: SelectItem[] = [];
  parents: SelectItem[] = [];
  gender: SelectItem[] = [];
  classes: SelectItem[] = [];
  sections: SelectItem[] = [];
  countries: SelectItem[] = [];
  states: SelectItem[] = [];
  cities: SelectItem[] = [];
  status: SelectItem[] = [];

  maxDate= new Date();

  querytype:number;
  constructor(private studentsService: StudentsService,private dropdownService: DropdownService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private location:Location) {
    this.maxDate.setDate(this.maxDate.getDate()); 
 
    this.gender = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ];
    
    this.status = [
      { label: 'Active', value: 'AC' }, 
      { label: 'Not Active', value: 'NA' }
    ];
     //Get Dropdowns API call
     var dropdowns = ["branches","sections","classes","countries","states","cities","parents"];
     this.dropdownService.getDropdowns(dropdowns)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) {
        this.classes = result.data.classes;
        this.sections = result.data.sections;
        this.branches = result.data.branches;
        this.countries = result.data.countries;
        this.states = result.data.states;
        this.cities = result.data.cities;
        this.parents = result.data.parents;
       }      
     });  
  }

  ngOnInit(): void {    
   //to read url parameters
   this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
    this.studentId = window.atob(params['id']);
    this.formType = window.atob(params['type']);
  });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Student";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Student";
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
    this.addStudentForm = this.fb.group({
      'firstName': new FormControl('', { validators: [Validators.required] }),
      'middleName': new FormControl(''),
      'lastName': new FormControl('', { validators: [Validators.required] }),
      'branch': new FormControl('', { validators: [Validators.required] }),
      'parent': new FormControl('', { validators: [Validators.required] }),
      'dateofbirth': new FormControl('', { validators: [Validators.required] }),
      'gender': new FormControl('', { validators: [Validators.required] }),
      'joineddate': new FormControl('', { validators: [Validators.required] }),
      'email': new FormControl('',{ validators: [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] }),
      'class': new FormControl('', { validators: [Validators.required] }),
      'section': new FormControl('', { validators: [Validators.required] }),
      'd_noc': new FormControl(''),
      'streetc': new FormControl(''),
      'countryc': new FormControl(''),
      'statec': new FormControl('',{ validators: [Validators.required] }),
      'villagec': new FormControl(''),
      'cityc': new FormControl('',{ validators: [Validators.required] }),
      'pincodec': new FormControl('',{ validators: [Validators.pattern('[0-9]{6}')] }),
      'homephn': new FormControl(''),
      'mblno':  new FormControl('', { validators: [Validators.required,Validators.pattern('[0-9]\\d{9}')] }),
      'd_nop': new FormControl(''),
      'streetp': new FormControl(''),
      'countryp': new FormControl(''),
      'statep': new FormControl('',{ validators: [Validators.required] }),
      'villagep': new FormControl(''),
      'cityp': new FormControl('',{ validators: [Validators.required] }),
      'pincodep': new FormControl('',{ validators: [Validators.pattern('[0-9]{6}')] }),
     'e1fname': new FormControl(''),
      'e1lname': new FormControl(''),
      'e1mobile': new FormControl('', { validators: [Validators.pattern('[0-9]\\d{9}')] }),
      'e1email':new FormControl('',{ validators: [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] }),
      'e2fname': new FormControl(''),
      'e2lname': new FormControl(''),
      'e2mobile': new FormControl('', { validators: [Validators.pattern('[0-9]\\d{9}')] }),
      'e2email': new FormControl('',{ validators: [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] }),
      'status': new FormControl('',{ validators: [Validators.required] }),
    });
  }

  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Student";
  }

  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditStudentDetails();
  }

  bindEditStudentDetails() {   
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.studentId;
    // pagingData.queryType = this.querytype;
    //Get Branches API call
    this.studentsService.getStudents(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.addStudentForm.setValue({
            'firstName': this.editData.ctcstudent_firstname,
            'middleName': this.editData.ctcstudent_middlename,
            'lastName': this.editData.ctcstudent_lastname,
            'branch': this.editData.branch_id,
            'parent':this.editData.ctcparent_id,
            'dateofbirth': new Date(this.editData.ctcstudent_dob),
            'gender': this.editData.ctcstudent_gender,
            'joineddate':new Date(this.editData.ctcstudent_joindate),
            'email': this.editData.ctcstudent_email,
            'class': this.editData.ctcstudent_class,
            'section': this.editData.ctcstudent_section,
            'd_noc': this.editData.ctcstudent_dno_c,
            'streetc': this.editData.ctcstudent_street_c,
            'countryc': this.editData.ctcstudent_country_c,
            'statec': this.editData.ctcstudent_state_c,
            'villagec': this.editData.ctcstudent_village_c,
            'cityc': this.editData.ctcstudent_city_c,
            'pincodec': this.editData.ctcstudent_pincode_c,
            'homephn': this.editData.ctcstduent_home_ph_c,
            'mblno': this.editData.ctcstudent_mobile_ph_c,
            'd_nop': this.editData.ctcstudent_country_p,
            'streetp': this.editData.ctcstudent_street_p,
            'countryp': this.editData.ctcstudent_country_p,
            'statep': this.editData.ctcstudent_state_p,
            'villagep': this.editData.ctcstudent_village_p,
            'cityp': this.editData.ctcstudent_city_p,
            'pincodep': this.editData.ctcstudent_pincode_p,           
            'e1fname': this.editData.ctce1fname,
            'e1lname': this.editData.ctce1lname,
            'e1email': this.editData.ctce1email,
            'e1mobile':this.editData.ctce1mobile,
            'e2fname': this.editData.ctce2fname,
            'e2lname': this.editData.ctce2lname,
            'e2email': this.editData.ctce2email,
            'e2mobile':this.editData.ctce2mobile,
            'status':this.editData.ctcstudent_status

          })
        }
      });   
  }
  addStudentSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addStudentForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Students();
      customObj = this.addStudentForm.value;
      customObj.dateofbirth = this.getFormat(customObj.dateofbirth);
      customObj.joineddate = this.getFormat(customObj.joineddate);
      customObj.id = this.studentId;
      customObj.querytype = this.querytype;
      customObj.classs = this.addStudentForm.controls['class'].value;
      
      //AED Students API call
      this.studentsService.AEDStudents(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addStudentForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = AppConstants.Messages.errorMessage;
          }
        });
    }
  }

  getFormat(createddate):string{
    return moment(createddate).format(Paginationutil.getServerSideDateFormat())
   }
  list(): void {
    // this.router.navigateByUrl("Teachers");
    this.location.back();
  }
  resetForm(): void {
    this.addStudentForm.reset();
    this.successMessage = "";
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
}
}
