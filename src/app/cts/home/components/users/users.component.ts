// 

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Users } from 'src/app/cts/shared/models/users';
import { UsersService } from 'src/app/cts/shared/services/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';

enum UserTypes {
  'PART' = "Parent",
  'TCHR' = "Teacher",
  'DEOP' = "Data Entry Operator",
  'ADMN' = "Admin"
}
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private ngUnsubscribe = new Subject();
  datasource: Users[];
  users: Users[];
  totalRecords: number;
  cols: any[];
  display:boolean=false;
  position: string;
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  usertypes: any[];
  experience: any[];
  loading: boolean;
  status:any;
  filtersForm: FormGroup;
  toBeDeletedId:any;
  errorMessage: string = "";
  successMessage: string = "";
  //pagination and api integration starts from here
  numberOfPages:number =10;
  totalcount:number=0;
  noOfItems=10;
  advancedFilterValue:string ="";
  currentPage:number = 1;
  pageCount:number;
  branches: SelectItem[] = [];

  constructor(private UsersService: UsersService,private dropdownService: DropdownService, private router: Router,private route:ActivatedRoute, private fb: FormBuilder) {
    this.usertypes = [
      { label: 'Admin', value: 'ADMN' },
      { label: 'DataEntryOperator', value: 'DEOP' },
      { label: 'Teacher', value: 'TCHR' },
      { label: 'Parent', value: 'PART' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'In Active', value: 'NA' },
    ];
    this.users = [];
      //Get Dropdowns API call
      var dropdowns = ["branches"];
      this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {     
         this.branches = result.data.branches;        
        }      
      });

  }

  toggleClass($event: any) {
    if (this.myFiltersDiv.nativeElement.classList.contains('transform-active'))
      this.myFiltersDiv.nativeElement.classList.remove('transform-active')
    else
      this.myFiltersDiv.nativeElement.classList.add('transform-active')
  }
 //Crud events
 addNew($event: any) {
  let id="0";
  this.router.navigate(['add-user'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
}
editUser(id):void{
  this.router.navigate(['add-user'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
}
viewUser(id):void{
  this.router.navigate(['add-user'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
}
  deleteUser(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  userRevoke():void{
    this.display=false;
    let customObj = new Users();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.UsersService.AEDUsers(customObj)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) {       
         this.successMessage = AppConstants.Messages.successMessage;
       }else{
         this.errorMessage = AppConstants.Messages.errorMessage;
       }
     }); 
    
  }

  public ngOnInit() {   
    this.cols = [
      { field: 'usertype', header: 'User Type' },
      { field: 'username', header: 'User Name' },
      { field: 'displayname', header: 'Display Name' },
      { field: 'branchtitle', header: 'Branch' },
      { field: 'createddate', header: 'Created On' },
      { field: 'userstatus', header: 'User Status' }
    ];
    this.loading = true;
     //to create form with validations
    this.createFilterForm();
  } 

  //Api Integration Starts from here
  onPageChange(event:LazyLoadEvent){
    let pageObject = Paginationutil.getGridFilters(event,this.advancedFilterValue);

    this.currentPage = pageObject.currentPage;

    let isinitialload = this.pageCount == undefined || this.pageCount == null;
    this.pageCount = pageObject.pageCount;

    let currentrows = event.rows * pageObject.pageNo;

    if(this.totalcount != 0){
      this.noOfItems =(currentrows < this.totalcount ? currentrows : this.totalcount);
    }

    this.loadGrids(JSON.stringify(pageObject));

  }

  loadGrids(pagingData){
    let paging = JSON.parse(pagingData);
    //Get Branches API call
    this.UsersService.getUsers(pagingData)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
      this.users= result.data;
      //pagination starts from here
      this.totalcount = parseInt(result.total);    

      if(this.totalcount <= paging.pageSize){
        this.noOfItems = this.totalcount;
      }else{
        this.noOfItems = (JSON.parse(pagingData)).pageSize;
      }

      if(this.users != null && this.users != undefined){
        this.users = this.users.map(function(el,i){
          var o = Object.assign({},el);
          o.indexId = i;
          return o;
        });
      }
      let currentrows = (this.currentPage * this.numberOfPages);
    }
    });
  }
  //API Integration ends here

  //filter code starts from here
  createFilterForm() {
    this.filtersForm = this.fb.group({
      'tusertype': new FormControl(''),
      'tuserName': new FormControl(''),
      'tuserstatus':new FormControl(''),
      'tbranch':new FormControl(''),
      'tcreateddate':new FormControl('')

    });
  }
  filterSubmit(): void {
    console.log(this.filtersForm.value);
  }
  //Reset form method
  resetFilterForm(): void {
    this.filtersForm.reset();
    console.log(this.filtersForm.value);
  }
//to get date format
getFormat(createddate):string{
  return moment(createddate).format(Paginationutil.getDefaultFormat())
 }
 checkPermissions(permissionValue){
  return  AuthorizationGuard.checkPermission(permissionValue);
 }

   //to get date format
getFilterFormat(createddate):string{
  return moment(createddate).format(Paginationutil.getFilterDateFormat())
 }
}
