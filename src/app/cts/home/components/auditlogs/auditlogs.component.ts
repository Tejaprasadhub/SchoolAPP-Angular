import { Component, OnInit } from '@angular/core';
import { Auditlogs } from 'src/app/cts/shared/models/auditlogs';
import { AuditlogsService } from 'src/app/cts/shared/services/auditlogs.service';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { map,takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';

@Component({
  selector: 'app-auditlogs',
  templateUrl: './auditlogs.component.html',
  styleUrls: ['./auditlogs.component.scss']
})
export class AuditlogsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Auditlogs[];
  auditlogs: Auditlogs[];
  totalRecords: number;
  cols: any[];
  loading: boolean;
  //pagination and api integration starts from here
  numberOfPages:number =10;
  totalcount:number=0;
  noOfItems=10;
  advancedFilterValue:string ="";
  currentPage:number = 1;
  pageCount:number;

  constructor(private AuditlogsService: AuditlogsService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cols = [
      // { field: 'id', header: 'S.no' },
      { field: 'code', header: 'Code' },
      { field: 'tablename', header: 'Audit Log Table' },
    ];
    this.loading = true;
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
    this.AuditlogsService.getAuditlogs(pagingData)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
      this.auditlogs= result.data;
      //pagination starts from here
      this.totalcount = parseInt(result.total);    

      if(this.totalcount <= paging.pageSize){
        this.noOfItems = this.totalcount;
      }else{
        this.noOfItems = (JSON.parse(pagingData)).pageSize;
      }

      if(this.auditlogs != null && this.auditlogs != undefined){
        this.auditlogs = this.auditlogs.map(function(el,i){
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

  rowExpand(event, data) {
    this.router.navigate(['add-auditlog'], { relativeTo: this.route,
      queryParams: { 
        code: window.btoa(event.data.code) }
     });
  }

}
