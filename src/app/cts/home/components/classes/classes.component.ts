import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Classes } from 'src/app/cts/shared/models/classes';
import { ClassesService } from 'src/app/cts/shared/services/classes.service';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Classes[];
  classes: Classes[];
  totalRecords: number;
  cols: any[];
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  loading: boolean;
  display:boolean=false;
  position: string;
  filtersForm: FormGroup;
  sections: SelectItem[] = [];
  toBeDeletedId:any;
  errorMessage: string = "";
  status: SelectItem[] = [];
  usertypes: any[];
  successMessage: string = "";
  //pagination and api integration starts from here
  numberOfPages:number =10;
  totalcount:number=0;
  noOfItems=10;
  advancedFilterValue:string ="";
  currentPage:number = 1;
  pageCount:number;

  constructor(private ClassesService: ClassesService, private router: Router, private route: ActivatedRoute,private fb: FormBuilder) {
    this.classes = [];
    this.sections = [
      { label: '1-section', value: '1' },
      { label: '2-sections', value: '2' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
    this.usertypes = [
      { label: 'Admin', value: 'ADMN' },
      { label: 'DataEntryOperator', value: 'DEOP' },
      { label: 'Teacher', value: 'TCHR' },
      { label: 'Parent', value: 'PART' }
    ];
  }

  public ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'noofsections', header: 'No.of Sections' },
      { field: 'createddate', header: 'Created Date' },
      { field: 'createdby', header: 'Created By' },
      { field: 'status', header: 'Status' }
    ];
    this.loading = true;
    //to create form with validations
    this.createFilterForm();
  } 

  toggleClass($event: any) {
    if (this.myFiltersDiv.nativeElement.classList.contains('transform-active'))
      this.myFiltersDiv.nativeElement.classList.remove('transform-active')
    else
      this.myFiltersDiv.nativeElement.classList.add('transform-active')
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
  this.ClassesService.getClasses(pagingData)
  .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
    if(result.success){
    this.classes= result.data;
    //pagination starts from here
    this.totalcount = parseInt(result.total);    

    if(this.totalcount <= paging.pageSize){
      this.noOfItems = this.totalcount;
    }else{
      this.noOfItems = (JSON.parse(pagingData)).pageSize;
    }

    if(this.classes != null && this.classes != undefined){
      this.classes = this.classes.map(function(el,i){
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



  //Crud events
  addNew($event: any) {
    let id="0";
    this.router.navigate(['add-class'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
  }
  editClass(id):void{
    this.router.navigate(['add-class'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
  }
  viewClass(id):void{
    this.router.navigate(['add-class'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
  }
  deleteClass(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  classRevoke():void{
    this.display=false;
    let customObj = new Classes();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.ClassesService.AEDClasses(customObj)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) {       
         this.successMessage = AppConstants.Messages.successMessage;
       }else{
         this.errorMessage = AppConstants.Messages.errorMessage;
       }
     }); 
  }
 //Filters code starts from here
   //Create form method to constuct a form with validations
   createFilterForm() {
    this.filtersForm = this.fb.group({
      'tclass': new FormControl(''),
      'tsection': new FormControl(''),
      'tcreateddate': new FormControl(''),    
      'tusertype': new FormControl(''),     
      'tstatus': new FormControl('') 
    });
  }

  // Add Teacher method
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
 getFilterFormat(createddate):string{
  return moment(createddate).format(Paginationutil.getFilterDateFormat())
 }
}

