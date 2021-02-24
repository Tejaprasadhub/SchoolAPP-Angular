import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/cts/shared/models/users';
// import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Utility } from 'src/app/cts/shared/models/utility';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { UsersService } from 'src/app/cts/shared/services/users.service';
import { AppConstants } from 'src/app/cts/app-constants';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: Users[];
  usertypes: any;
  status: any;
  branches: any[];
  parents: any[];
  teachers: any[];

  private ngUnsubscribe = new Subject();
  userId: number;
  formType: string;
  editData: any;
  pageTitle: string;
  isDisabled: boolean = false;
  isRequired: boolean = false;
  successMessage: string = "";
  errorMessage: string = "";
  querytype: number;
  userType: string = "";
  userData: any;

  //to create Teacher From 
  addUserForm: FormGroup;
  formSubmitAttempt: boolean = false;
  constructor(private dropdownService: DropdownService, private UsersService: UsersService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private location: Location) {
    this.usertypes = [
      { label: 'Admin', value: 'ADMN' },
      { label: 'Data Entry Operator', value: 'DEOP' },
      { label: 'Teacher', value: 'TCHR' },
      { label: 'Parent', value: 'PART' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'In Active', value: 'NA' },
    ];

    //Get Dropdowns API call
    var dropdowns = ["branches", "parents", "teachers"];
    this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.branches = result.data.branches;
          this.parents = result.data.parents;
          this.teachers = result.data.teachers;
        }
      });
  }

  ngOnInit(): void {
    //to read url parameters
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.userId = Number(window.atob(params['id']));
      this.formType = window.atob(params['type']);
    });


    if (this.formType == "create") {
      this.pageTitle = "Add User";
      this.isDisabled = false;
      this.isRequired = true;
      this.querytype = 1;
    }
    else if (this.formType == "edit") {
      this.pageTitle = "Edit User";
      this.editControls();
      this.fetchData();
      this.querytype = 2;
    }
    else {
      this.pageTitle = "View Details";
      this.isDisabled = true;
      this.isRequired = false;
      this.fetchData();
      this.querytype = 2;
    }
    this.createForm();
    this.addUserForm.get('usertype').valueChanges.subscribe(
      (usertype1: string) => {
        if (usertype1 === 'PART') {
          this.addUserForm.get('parent').setValidators([Validators.required]);
          this.addUserForm.get('teacher').setValidators(null);
        } else if (usertype1 === 'TCHR') {
          this.addUserForm.get('parent').setValidators(null);
          this.addUserForm.get('teacher').setValidators([Validators.required]);
        } else {
          this.addUserForm.get('parent').setValidators(null);
          this.addUserForm.get('teacher').setValidators(null);
        }
        this.addUserForm.get('parent').updateValueAndValidity();
        this.addUserForm.get('teacher').updateValueAndValidity();
      });
  }

  createForm() {
    this.addUserForm = this.fb.group({
      'usertype': new FormControl('', { validators: [Validators.required] }),
      'branchid': new FormControl('', { validators: [Validators.required] }),
      'teacher': new FormControl(''),
      'parent': new FormControl(''),
      'userName': new FormControl('', { validators: [Validators.required] }),
      'userstatus': new FormControl('', { validators: [Validators.required] }),
      'email': new FormControl('', { validators: [Validators.required, , Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")] }),
      'dispName': new FormControl('', { validators: [Validators.required, Validators.pattern('^([A-Za-z0-9 _\'-])*$')] }),
      'password': new FormControl('', {
        validators: [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ]
      })

    });
  }


  private fetchData() {
    // this.loadGender(this.gender);
    this.bindEditUserDetails();
  }
  bindEditUserDetails() {
    let pagingData = new Utility();
    pagingData = JSON.parse(Paginationutil.getDefaultFilter());
    pagingData.idValue = this.userId.toString();
    //Get Branches API call
    this.UsersService.getUsers(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.editData = result.data[0];
          this.userType = this.editData.usertype;
          this.addUserForm.patchValue({
            'usertype': this.editData.usertype,
            'userName': this.editData.username,
            'dispName': this.editData.displayname,
            'branchid': this.editData.branchid,
            'userstatus': this.editData.userstatus,
            'password': this.editData.userpassword,
            'email': this.editData.useremail,
            'parent': this.editData.parentid,
            'teacher': this.editData.teacherid
          })
        }
      });
  }




  addUserSubmit(): void {
    // this.formSubmitAttempt = true;
    // this.successMessage="";
    // if(this.addUserForm.valid){
    //   this.formSubmitAttempt=false;
    // this.addUserForm.reset();     
    //   this.successMessage="Your changes have been successfully saved";
    // }
    this.errorMessage = "";
    this.successMessage = "";
    this.formSubmitAttempt = true;
    if (this.addUserForm.valid) {
      this.formSubmitAttempt = false;
      let customObj = new Users();
      customObj = this.addUserForm.value;
      customObj.id = this.userId;
      customObj.querytype = this.querytype;
      // console.log(customObj)
      //AED Branches API call
      this.UsersService.AEDUsers(customObj)
        .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
          if (result.success) {
            // this.branches= result.data;    
            if (this.formType == "create") {
              this.addUserForm.reset();
            }
            this.successMessage = AppConstants.Messages.successMessage;
          } else {
            this.errorMessage = "User already exists";
          }
        },
          error => {
            this.router.navigate(['/admin/app-error'], { queryParams: { message: window.btoa(error.message) } });
        });
    }
  }
  resetForm(): void {
    this.addUserForm.reset();
    this.successMessage = "";
  }
  editControls(): void {
    this.isRequired = true;
    this.isDisabled = false;
    this.pageTitle = "Edit User";
  }
  list(): void {
    // this.router.navigateByUrl("Teachers");
    this.location.back();
    // this.router.navigate(['/Teachers'], {relativeTo: this.route});
  }

  dropdownChange(event): void {
    // alert(event.value);
    this.userType = event.value;
    console.log(this.userType);
    this.addUserForm.get('email').setValue("");
    this.addUserForm.get('dispName').setValue("");
    this.addUserForm.get('userName').setValue("");
  }

  userDropDownChange(event, type): void {
    // alert(event.value);    
    if (type == 'T') {
      this.userData = this.teachers.filter(teacher => teacher.value == event.value)[0];
    } else if (type == 'P') {
      this.userData = this.parents.filter(parent => parent.value == event.value)[0];
    }
    this.addUserForm.get('email').setValue(this.userData.email);
    this.addUserForm.get('dispName').setValue(this.userData.name);
    this.addUserForm.get('userName').setValue(this.userData.name);
  }

}
