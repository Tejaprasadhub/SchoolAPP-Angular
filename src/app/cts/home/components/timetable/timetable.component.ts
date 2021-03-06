import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Timetable } from 'src/app/cts/shared/models/timetable';
import { TimetableService } from 'src/app/cts/shared/services/timetable.service';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';;
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Timetable[];
  timetable: Timetable[];
  totalRecords: number;
  cols: any[];
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  loading: boolean;
  errorMessage:string="";
  successMessage:string="";
  display:boolean=false;
  position: string;
  filtersForm: FormGroup;
  classid: any[]=[];
  sections: any[]=[];
  subjectid: any[]=[];
  teacherid: any[]=[];
  status: any[]=[];
  users: any[]=[];
  toBeDeletedId:any;

   //pagination and api integration starts from here
   numberOfPages:number =10;
   totalcount:number=0;
   noOfItems=10;
   advancedFilterValue:string ="";
   currentPage:number = 1;
   pageCount:number;
 
   @ViewChild(Table, { static: false }) DataTable: Table;

  constructor(private dropdownService: DropdownService,private TimetableService: TimetableService, private router: Router,private route:ActivatedRoute,private fb: FormBuilder) {
    
    this.timetable = [];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
    var dropdowns = ["classes","subjects","teachers","users","sections"];
    this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.classid = result.data.classes;
          this.subjectid = result.data.subjects;
          this.teacherid = result.data.teachers;
          this.users = result.data.users;
          this.sections = result.data.sections;
        }
      });
  }

  public ngOnInit() {
    this.cols = [
      { field: 'class', header: 'Class' },
      { field: 'section', header: 'Section' },
      { field: 'subject', header: 'Subject' },
      { field: 'teacher', header: 'Teacher' },
      { field: 'periodfrom', header: 'Period From' },
      { field: 'periodto', header: 'Period To' },
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
  this.TimetableService.getTimetable(pagingData)
  .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
    if(result.success){
    this.timetable= result.data;
    //pagination starts from here
    this.totalcount = parseInt(result.total);    

    if(this.totalcount <= paging.pageSize){
      this.noOfItems = this.totalcount;
    }else{
      this.noOfItems = (JSON.parse(pagingData)).pageSize;
    }

    if(this.timetable != null && this.timetable != undefined){
      this.timetable = this.timetable.map(function(el,i){
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
  this.router.navigate(['add-timetable'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
}
editTimetable(id):void{
  this.router.navigate(['add-timetable'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
}
viewTimetable(id):void{
  this.router.navigate(['add-timetable'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
}
  deleteTimetable(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  timetableRevoke():void{
    this.display=false;
    let customObj = new Timetable();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.TimetableService.AEDTimetable(customObj)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) { 
        this.DataTable.reset();               
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
      'tclassid': new FormControl(''),
      'tsectionid': new FormControl(''),
      'tsubjectid': new FormControl(''),
      'tteaherid': new FormControl(''),
      'tperiodfrom': new FormControl(''),
      'tperiodto': new FormControl(''),
      'tcreateddate': new FormControl(''),
      'tusertype': new FormControl(''),
      'tstatus': new FormControl(''),
    });
  }
  filterSubmit(): void {
    console.log(this.filtersForm.value);
  }
  //Reset form method
  resetFilterForm(): void {
    this.filtersForm.reset();
    this.DataTable.reset();
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
