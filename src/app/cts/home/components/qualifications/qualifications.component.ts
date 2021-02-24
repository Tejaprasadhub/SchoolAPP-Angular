import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Qualifications } from 'src/app/cts/shared/models/qualifications';
import { QualificationsService } from 'src/app/cts/shared/services/qualifications.service';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';


@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.scss']
})
export class QualificationsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Qualifications[];
  qualifications: Qualifications[];
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

  constructor(private QualificationsService: QualificationsService, private router: Router,private route:ActivatedRoute,private fb: FormBuilder) {
    this.qualifications = [];
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
      { field: 'title', header: 'Title' },
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
    this.QualificationsService.getQualifications(pagingData)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
      this.qualifications= result.data;
      //pagination starts from here
      this.totalcount = parseInt(result.total);    

      if(this.totalcount <= paging.pageSize){
        this.noOfItems = this.totalcount;
      }else{
        this.noOfItems = (JSON.parse(pagingData)).pageSize;
      }

      if(this.qualifications != null && this.qualifications != undefined){
        this.qualifications = this.qualifications.map(function(el,i){
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
  this.router.navigate(['add-qualification'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
}
editQualification(id):void{
  this.router.navigate(['add-qualification'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
}
viewQualification(id):void{
  this.router.navigate(['add-qualification'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
}
  deleteQualification(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  qualificationRevoke():void{
    this.display=false;
    let customObj = new Qualifications();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.QualificationsService.AEDQualifications(customObj)
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
      'ttitle': new FormControl(''),
      'tyear': new FormControl(''),
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
