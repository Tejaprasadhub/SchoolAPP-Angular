import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Achievements } from 'src/app/cts/shared/models/achievements';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AchievementsService } from 'src/app/cts/shared/services/achievements.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Achievements[];
  achievements: Achievements[];
  totalRecords: number;
  cols: any[];
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  loading: boolean;
  errorMessage:string="";
  successMessage:string="";
  display:boolean=false;
  position: string;
//to create Teacher From 
filtersForm: FormGroup;
toBeDeletedId:any;

 //pagination and api integration starts from here
 numberOfPages:number =10;
 totalcount:number=0;
 noOfItems=10;
 advancedFilterValue:string ="";
 currentPage:number = 1;
 pageCount:number;
  constructor(private AchievementsService: AchievementsService, private router: Router,private route:ActivatedRoute,private fb: FormBuilder) {
    this.achievements = [];
  }

  public ngOnInit() {    
    this.cols = [
      { field: 'title', header: 'Title' },
      { field: 'date', header: 'Date' },
      { field: 'branchtitle', header: 'Branch' },
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
  this.AchievementsService.getAchievements(pagingData)
  .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
    if(result.success){
    this.achievements= result.data;
    //pagination starts from here
    this.totalcount = parseInt(result.total);    

    if(this.totalcount <= paging.pageSize){
      this.noOfItems = this.totalcount;
    }else{
      this.noOfItems = (JSON.parse(pagingData)).pageSize;
    }

    if(this.achievements != null && this.achievements != undefined){
      this.achievements = this.achievements.map(function(el,i){
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
    this.router.navigate(['add-achievement'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
  }
  editAchievement(id):void{
    this.router.navigate(['add-achievement'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
  }
  viewAchievement(id):void{
    this.router.navigate(['add-achievement'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
  }
  deleteAchievement(id):void{
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  achievementRevoke():void{
    this.display=false;
    let customObj = new Achievements();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.AchievementsService.AEDAchievements(customObj)
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
      'tdate': new FormControl('')
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
}
