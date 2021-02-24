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
  classid: any[];
  subjectid: any[];
  teacherid: any[];
  toBeDeletedId:any;

   //pagination and api integration starts from here
   numberOfPages:number =10;
   totalcount:number=0;
   noOfItems=10;
   advancedFilterValue:string ="";
   currentPage:number = 1;
   pageCount:number;
 

  constructor(private TimetableService: TimetableService, private router: Router,private route:ActivatedRoute,private fb: FormBuilder) {
    this.classid = [
      { label: 'class1', value: '1' },
      { label: 'class2', value: '2' },
      { label: 'class3', value: '3' }
    ];
    this.subjectid = [
      { label: 'subject1', value: '1' },
      { label: 'subject2', value: '2' },
      { label: 'subject3', value: '3' }
    ];
    this.teacherid = [
      { label: 'teacher1', value: '1' },
      { label: 'teacher2', value: '2' },
      { label: 'teacher3', value: '3' }
    ];
    this.timetable = [];
  }

  public ngOnInit() {
    this.cols = [
      { field: 'class', header: 'Class Id' },
      { field: 'subject', header: 'Subject Id' },
      { field: 'teacher', header: 'Teacher Id' },
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
      'tsubjectid': new FormControl(''),
      'tteaherid': new FormControl(''),
      'tperiodfrom': new FormControl(''),
      'tperiodto': new FormControl('')
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
}
