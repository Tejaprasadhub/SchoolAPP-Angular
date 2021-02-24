import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Branches } from 'src/app/cts/shared/models/branches';
import { BranchesService } from 'src/app/cts/shared/services/branches.service';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  branches: Branches[];
  cols: any[];
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  display:boolean=false;
  position: string;
  filtersForm: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  toBeDeletedId:any;
  usertypes: any[];
  status: SelectItem[] = [];
  //pagination and api integration starts from here
  numberOfPages:number =10;
  totalcount:number=0;
  noOfItems=10;
  advancedFilterValue:string ="";
  currentPage:number = 1;
  pageCount:number;
  moment: any = moment;
  AppConstants:any;

 

  constructor(private BranchesService: BranchesService, private router: Router, private route: ActivatedRoute,private fb: FormBuilder) {
    this.branches = [];
    this.usertypes = [
      { label: 'Admin', value: 'ADMN' },
      { label: 'DataEntryOperator', value: 'DEOP' },
      { label: 'Teacher', value: 'TCHR' },
      { label: 'Parent', value: 'PART' }
    ];
    this.status = [
      { label: 'Active', value: 'AC' },
      { label: 'InActive', value: 'NA' }
    ];
   }

  ngOnInit(): void {
    //Table headers and fields
    this.cols = [
      { field: 'title', header: 'title' },
      { field: 'code', header: 'code' },
      { field: 'createddate', header: 'Created Date' },
      { field: 'createdby', header: 'Created By' },
      { field: 'status', header: 'Status' }
    ];
     //to create form with validations
     this.createFilterForm();
  }
  //Search box toggling
  toggleBranch($event: any) {
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
    this.BranchesService.getBranches(pagingData)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
      this.branches= result.data;
      //pagination starts from here
      this.totalcount = parseInt(result.total);    

      if(this.totalcount <= paging.pageSize){
        this.noOfItems = this.totalcount;
      }else{
        this.noOfItems = (JSON.parse(pagingData)).pageSize;
      }

      if(this.branches != null && this.branches != undefined){
        this.branches = this.branches.map(function(el,i){
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
    this.router.navigate(['add-branch'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
  }
  editBranch(id):void{
    this.router.navigate(['add-branch'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
  }
  viewBranch(id):void{
    this.router.navigate(['add-branch'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
  }
  deleteBranch(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  branchRevoke():void{
    this.display=false;
    let customObj = new Branches();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.BranchesService.AEDBranches(customObj)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) {       
         this.successMessage = AppConstants.Messages.successMessage;
       }else{
         this.errorMessage = AppConstants.Messages.errorMessage;
       }
     }); 
  }
 //Filters code starts from here
   //Construct Filter Form
   createFilterForm() {
    this.filtersForm = this.fb.group({
      'ttitle': new FormControl(''),
      'tcode': new FormControl(''),
      'tcreateddate': new FormControl(''),    
      'tusertype': new FormControl(''),     
      'tstatus': new FormControl('')         
    });
  }
  //Filter Submit method
  filterSubmit(): void {
    console.log(this.filtersForm.value);
  }
  //Filter Reset method
  resetFilterForm(): void {
    this.filtersForm.reset();    
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
