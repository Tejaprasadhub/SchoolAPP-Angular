import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Subjects } from 'src/app/cts/shared/models/subjects';
import { SubjectsService } from 'src/app/cts/shared/services/subjects.service';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';


@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Subjects[];
  subjects: Subjects[];
  totalRecords: number;
  cols: any[];
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  loading: boolean;
  errorMessage:string="";
  successMessage:string="";
  display:boolean=false;
  position: string;
  filtersForm: FormGroup;
  toBeDeletedId:any;
  status: SelectItem[] = [];
  usertypes: any[];
  //pagination and api integration starts from here
  numberOfPages:number =10;
  totalcount:number=0;
  noOfItems=10;
  advancedFilterValue:string ="";
  currentPage:number = 1;
  pageCount:number;

  constructor(private SubjectsService: SubjectsService, private router: Router,private route:ActivatedRoute,private fb: FormBuilder) {
    this.subjects = [];
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
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
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
  this.SubjectsService.getSubjects(pagingData)
  .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
    if(result.success){
    this.subjects= result.data;
    //pagination starts from here
    this.totalcount = parseInt(result.total);    

    if(this.totalcount <= paging.pageSize){
      this.noOfItems = this.totalcount;
    }else{
      this.noOfItems = (JSON.parse(pagingData)).pageSize;
    }

    if(this.subjects != null && this.subjects != undefined){
      this.subjects = this.subjects.map(function(el,i){
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
  this.router.navigate(['add-subject'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
}
editSubject(id):void{
  this.router.navigate(['add-subject'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
}
viewSubject(id):void{
  this.router.navigate(['add-subject'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
}
  deleteSubject(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  subjectRevoke():void{
    this.display=false;
    let customObj = new Subjects();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.SubjectsService.AEDSubjects(customObj)
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
      'tcode': new FormControl(''),
      'tname': new FormControl(''),
      'tcreateddate': new FormControl(''),    
      'tusertype': new FormControl(''),     
      'tstatus': new FormControl('') 
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
   getFilterFormat(createddate):string{
    return moment(createddate).format(Paginationutil.getFilterDateFormat())
   }
}
