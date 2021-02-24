import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Addauditlog } from 'src/app/cts/shared/models/addauditlog';
import { AddauditlogService } from 'src/app/cts/shared/services/addauditlog.service';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { AuditlogsService } from 'src/app/cts/shared/services/auditlogs.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-auditlog',
  templateUrl: './add-auditlog.component.html',
  styleUrls: ['./add-auditlog.component.scss']
})
export class AddAuditlogComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  auditLogs: Addauditlog[];
  datasource: Addauditlog[];
  totalRecords: number;
  filtersForm: FormGroup;
  actions: any[];
  users: any[];
  cols: any[];
  loading: boolean;
  tablecode:any;
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;

    //pagination and api integration starts from here
    numberOfPages:number =10;
    totalcount:number=0;
    noOfItems=10;
    advancedFilterValue:string ="";
    currentPage:number = 1;
    pageCount:number;
    moment: any = moment;
    AppConstants:any;

  constructor(private auditLogService:AuditlogsService,private route: ActivatedRoute,private fb: FormBuilder,private addauditlogService: AddauditlogService) {
    this.actions = [
      { label: 'Insert', value: 'Insert' },
      { label: 'Delete', value: 'Delete' },
      { label: 'Update', value: 'Update' }
    ];
    this.users = [
      { label: 'Admin', value: 'ADMN' },
      { label: 'Operator', value: 'OPTR' },
      { label: 'Teacher', value: 'TCHR' }
    ];
   }
   toggleClass($event: any) {
    if (this.myFiltersDiv.nativeElement.classList.contains('transform-active'))
    this.myFiltersDiv.nativeElement.classList.remove('transform-active')
  else
    this.myFiltersDiv.nativeElement.classList.add('transform-active')
  }
  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {     
      this.tablecode = window.atob(params['code']);      
    });
   
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'date', header: 'Date' },
      { field: 'fieldname', header: 'Fieldname' },
      { field: 'action', header: 'Action' },
      { field: 'oldvalue', header: 'Oldvalue ' },
      { field: 'newvalue', header: 'Newvalue' },
      { field: 'user', header: 'User' }
    ];
    this.loading = true;

    //to create form with validations
    this.createFilterForm();
  }
  createFilterForm() {
    this.filtersForm = this.fb.group({
      'fieldname': new FormControl(''),
      'oldvalue': new FormControl(''),
      'newvalue': new FormControl(''),
      'processeduser': new FormControl(''),
      'fromdate': new FormControl(''),
      'todate': new FormControl(''),
      'action': new FormControl(''),
    });
  }
  resetForm(): void {
    this.filtersForm.reset();
  }
 //Api Integration Starts from here
 onPageChange(event:LazyLoadEvent){
  let pageObject = Paginationutil.getGridFilters(event,this.advancedFilterValue);
  pageObject.tablecode=this.tablecode;
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
  
  this.auditLogService.AuditlogTableDetails(pagingData)
  .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
    if(result.success){
    this.auditLogs= result.data;
    //pagination starts from here
    this.totalcount = parseInt(result.total);    

    if(this.totalcount <= paging.pageSize){
      this.noOfItems = this.totalcount;
    }else{
      this.noOfItems = (JSON.parse(pagingData)).pageSize;
    }

    if(this.auditLogs != null && this.auditLogs != undefined){
      this.auditLogs = this.auditLogs.map(function(el,i){
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

}
