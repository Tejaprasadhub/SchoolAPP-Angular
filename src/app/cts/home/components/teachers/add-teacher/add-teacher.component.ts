import { Component, OnInit } from '@angular/core';
import { Gender } from 'src/app/cts/shared/models/gender';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { element } from 'protractor';
import { Location } from '@angular/common';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { Teachers } from 'src/app/cts/shared/models/teachers';
import * as moment from 'moment';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { Utility } from 'src/app/cts/shared/models/utility';
import { TeachersService } from 'src/app/cts/shared/services/teachers.service';
import { AppConstants } from 'src/app/cts/app-constants';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {
  branches: SelectItem[] = [];
  gender: SelectItem[] = [];
  qualification: SelectItem[] = [];
  experience: SelectItem[] = [];
  teacherId: string;
  formType: string;
  pageTitle: string;
  editData: any;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  display: boolean = false;
  expertiseIn: SelectItem[] = [];
  associatedClasses: SelectItem[] = [];
  associatedSections: SelectItem[] = [];
  private ngUnsubscribe = new Subject();
  //to create Teacher From 
  addTeacherForm: FormGroup;
  formSubmitAttempt: boolean = false;
  errorMessage: string = "";
  successMessage: string = "";

  querytype:number;

  

  constructor(private teachersService:TeachersService, private dropdownService: DropdownService,private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
    
       //Get Dropdowns API call
       var dropdowns = ["branches","qualifications","experiences","sections","subjects","classes"];
       this.dropdownService.getDropdowns(dropdowns)
       .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
         if (result.success) {
          this.expertiseIn = result.data.subjects;
          this.associatedClasses = result.data.classes;
          this.qualification = result.data.qualifications;
          this.associatedSections = result.data.sections;
          this.experience = result.data.experiences;
          this.branches = result.data.branches;
         }
        
       });  

       this.gender=[
         {"label":"Male","value":"M"},
         {"label":"Female","value":"F"}        
       ]
    
  }

  

  ngOnInit(): void {
    // On page load
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.teacherId = window.atob(params['id']);
      this.formType = window.atob(params['type']);
    });
    //to create form with validations
    this.createForm();
    //to check whether the form to be created or updated
    if (this.formType == "create") {
      this.pageTitle = "Add Teacher";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype=1;
    } else if (this.formType == "edit") {
      this.pageTitle = "Edit Teacher";
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
  //Create form method to constuct a form with validations
  createForm() {
    this.addTeacherForm = this.fb.group({
      'teacherName': new FormControl('', { validators: [Validators.required, Validators.pattern('^([A-Za-z0-9 _\'-])*$')] }),
      'branch': new FormControl('', { validators: [Validators.required] }),
      'dateofbirth': new FormControl('', { validators: [Validators.required] }),
      'gender': new FormControl('', { validators: [Validators.required] }),
      'qualification': new FormControl('', { validators: [Validators.required] }),
      'experience': new FormControl(''),
      'mobile': new FormControl('', { validators: [Validators.required, Validators.pattern('[0-9]\\d{9}')] }),
      'email': new FormControl('', { validators: [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] }),
      'expertiseIn': new FormControl('', { validators: [Validators.required] }),
      'associatedClasses': new FormControl('', { validators: [Validators.required] }),
      'associatedSections': new FormControl('', { validators: [Validators.required] })
    });
  }
  //to fetch data when edit teacher
  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditTeacherDetails();
  }
  // loadGender(datalist:any){
  //   this.gender=this.bindDropDownList(datalist,'gender');
  // }
  // bindDropDownList(datalist,type){   
  //   let outputList:SelectItem[]=[];
  //   outputList.push({label:"select",value:null})
  //   if(datalist != null){
  //     datalist.forEach(element=>{
  //       let obj:SelectItem;
  //       if(type=="gender"){
  //         obj={label:element.label,value:element.value}
  //       }
  //       outputList.push(obj);
  //     });
  //   }
  //   return outputList;
  // }
  //to bind data to controllers
  bindEditTeacherDetails() {

    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.teacherId.toString();
    //Get Teachers API call
    this.teachersService.getTeachers(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];          
          this.addTeacherForm.setValue({
            'teacherName': this.editData.teachername,
            'branch': Number(this.editData.branch),
            'dateofbirth': new Date(this.editData.dob),
            'gender': this.editData.gender,
            'qualification': this.editData.qualifications.map((el) => Number(el.value)),
            'experience': Number(this.editData.experience),
            'mobile': this.editData.mobilenumber,
            'email': this.editData.email,
            'expertiseIn': this.editData.subjects.map((el) => Number(el.value)),
            'associatedClasses': this.editData.classes.map((el) => Number(el.value)),
            'associatedSections': this.editData.sections.map((el) => Number(el.value))
          })
        }
      });


    // this.editData = {
    //   'teacherName': 'Teja prasad',
    //   'branch': '1',
    //   'dateofbirth': '4/5/2020',
    //   'gender': 'F',
    //   'qualification': 'OTH',
    //   'experience': '0-1',
    //   'mobile': '9640938361',
    //   'email': 'tejaprasadbehara@gmail.com',
    //   'expertiseIn': ['T', 'M'],
    //   'associatedClasses': ['1', '2'],
    //   'associatedSections': ['A', 'B']
    // }

    // console.log(this.editData.gender)
    // this.addTeacherForm.setValue({
    //   'teacherName': this.editData.teacherName,
    //   'branch': this.editData.branch,
    //   'dateofbirth': this.editData.dateofbirth,
    //   'gender': this.editData.gender,
    //   'qualification': this.editData.qualification,
    //   'experience': this.editData.experience,
    //   'mobile': this.editData.mobile,
    //   'email': this.editData.email,
    //   'expertiseIn': this.editData.expertiseIn,
    //   'associatedClasses': this.editData.associatedClasses,
    //   'associatedSections': this.editData.associatedSections
    // })
  }

 
  // Add Teacher method
  addTeacherSubmit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addTeacherForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Teachers();
      customObj = this.addTeacherForm.value;
      customObj.dateofbirth = this.getFormat(customObj.dateofbirth);
      customObj.classes = customObj.associatedClasses.join();
      customObj.sections = customObj.associatedSections.join();
      customObj.subjects = customObj.expertiseIn.join();
      customObj.qualifications = customObj.qualification.join();
      customObj.id = Number(this.teacherId);
      customObj.querytype = this.querytype;
      
      //AED Branches API call
      this.teachersService.AEDTeachers(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
            this.addTeacherForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          }else{
            this.errorMessage = AppConstants.Messages.errorMessage;
          }
        });
    }
  }
  //Reset form method
  resetForm(): void {
    this.addTeacherForm.reset();
    this.successMessage = "";
  }
  //to make controllers from disable to edit mode
  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit Teacher";
    this.querytype=2;
  }
  //navigating to Teachers list page
  list(): void {
    // this.router.navigateByUrl("Teachers");
    this.location.back();
    // this.router.navigate(['/Teachers'], {relativeTo: this.route});
  }

  //This is the method to clear all the form controllers
  private reset() {
    this.addTeacherForm = this.fb.group({
      'teacherName': new FormControl(''),
      'dateofbirth': new FormControl(''),
      'gender': new FormControl(''),
      'qualification': new FormControl(''),
      'experience': new FormControl(''),
      'mobile': new FormControl(''),
      'email': new FormControl(''),
      'expertiseIn': new FormControl(''),
      'associatedClasses': new FormControl(''),
      'associatedSections': new FormControl('')
    })
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getFormat(createddate):string{
    return moment(createddate).format(Paginationutil.getServerSideDateFormat())
   }
}
