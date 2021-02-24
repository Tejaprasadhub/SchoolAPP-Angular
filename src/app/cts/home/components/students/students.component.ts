import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Students } from 'src/app/cts/shared/models/students';
import { StudentsService } from 'src/app/cts/shared/services/students.service';
import { Subject } from 'rxjs';
import { map,takeUntil } from 'rxjs/operators';;
import { Gender, Class123 } from 'src/app/cts/shared/models/gender';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('1500ms cubic-bezier(0.1, 0, 0.07, 1)'))
    ])
]
})
export class StudentsComponent implements OnInit {

  private ngUnsubscribe = new Subject();
  datasource: Students[];

  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;

  students: Students[];

  totalRecords: number;

  cols: any[];
  sub: any;
  selectedColumns: any[];

  loading: boolean;
  display: boolean = false;
  position: string;
  errorMessage: string = "";
  successMessage: string = "";

  colors: SelectItem[];
  gender: any[];
  classes: any[];
  toBeDeletedId:any;

   //to create Teacher From 
   filtersForm: FormGroup;
   //pagination and api integration starts from here
  numberOfPages:number =10;
  totalcount:number=0;
  noOfItems=10;
  advancedFilterValue:string ="";
  currentPage:number = 1;
  pageCount:number;

  constructor(private StudentsService: StudentsService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.gender = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ];
    this.classes = [
      { label: '1st Class', value: '1' },
      { label: '2nd Class', value: '2' },
      { label: '3rd Class', value: '3' },
      { label: '4th Class', value: '4' },
      { label: '5th Class', value: '5' }
    ];
  }
  toggleClass($event: any) {
    if (this.myFiltersDiv.nativeElement.classList.contains('transform-active'))
      this.myFiltersDiv.nativeElement.classList.remove('transform-active')
    else
      this.myFiltersDiv.nativeElement.classList.add('transform-active')
  }
  public ngOnInit() {
  
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'firstname', header: 'Name' },
      { field: 'gender', header: 'Gender' },
      { field: 'dob', header: 'Date Of Birth' },
      { field: 'email', header: 'Email' },
      { field: 'classs', header: 'Class' },
      { field: 'branch', header: 'Branch ' },
      { field: 'createdby', header: 'Createdby' },
      { field: 'status', header: 'Status' }
    ];
    this.loading = true;

    this.colors = [
      { label: 'White', value: 'White' },
      { label: 'Green', value: 'Green' },
      { label: 'Silver', value: 'Silver' },
      { label: 'Black', value: 'Black' },
      { label: 'Red', value: 'Red' },
      { label: 'Maroon', value: 'Maroon' },
      { label: 'Brown', value: 'Brown' },
      { label: 'Orange', value: 'Orange' },
      { label: 'Blue', value: 'Blue' }
    ];
   

 //to create form with validations
 this.createFilterForm()

    // FilterUtils['custom'] = (value, filter): boolean => {
    //     if (filter === undefined || filter === null || filter.trim() === '') {
    //         return true;
    //     }

    //     if (value === undefined || value === null) {
    //         return false;
    //     }

    //     return parseInt(filter) > value;
    // }
   
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
  this.StudentsService.getStudents(pagingData)
  .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
    if(result.success){
    this.students= result.data;
    //pagination starts from here
    this.totalcount = parseInt(result.total);    

    if(this.totalcount <= paging.pageSize){
      this.noOfItems = this.totalcount;
    }else{
      this.noOfItems = (JSON.parse(pagingData)).pageSize;
    }

    if(this.students != null && this.students != undefined){
      this.students = this.students.map(function(el,i){
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
    // this.router.navigate(['student',{ outlets: { detail: ['student-profile'] } }], {relativeTo: this.route});
    this.router.navigate(['student',{ outlets: { detail: ['student-profile'] } }], { relativeTo: this.route,
      queryParams: { 
        id: window.btoa(event.data.id) }
     });
  }
  //Crud events
  addNew($event: any) {
    let id="0";
    this.router.navigate(['add-student'], { relativeTo: this.route, queryParams: { type: window.btoa('create'),id: window.btoa(id) } });
  }
  editStudent(id):void{
    this.router.navigate(['add-student'],{relativeTo: this.route,queryParams: { type: window.btoa('edit'), id: window.btoa(id) }});
  }
  viewStudent(id):void{
    this.router.navigate(['add-student'],{relativeTo: this.route,queryParams: { type: window.btoa('view'), id: window.btoa(id) }});
  }
  deleteStudent(id): void {
    this.position="top";
    this.display=true;
    this.toBeDeletedId = id;
  }
  studentRevoke(): void {
    this.display=false;
    let customObj = new Students();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.StudentsService.AEDStudents(customObj)
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
      'tname': new FormControl(''),
      'tgender': new FormControl(''),
      'tdateOfbirth': new FormControl(''),
      'temail': new FormControl(''),
      'tclass': new FormControl('')
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
    return moment(createddate).format(Paginationutil.getAngularDateFormat())
   }
}
