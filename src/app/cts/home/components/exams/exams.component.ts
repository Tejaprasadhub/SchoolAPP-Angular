import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, SelectItem } from 'primeng/api/public_api';
import { Exams } from 'src/app/cts/shared/models/exams';
import { ExamsService } from 'src/app/cts/shared/services/exams.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { AppConstants } from 'src/app/cts/app-constants';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { multiselectObject } from 'src/app/cts/shared/models/multi-select-object';
import { Table } from 'primeng/table';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';


@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
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
export class ExamsComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  datasource: Exams[];
  exams: any[];
  classes: any[];
  totalRecords: number;
  cols: any[];
  @ViewChild('myFiltersDiv') myFiltersDiv: ElementRef;
  loading: boolean;
  errorMessage: string = "";
  successMessage: string = "";
  display: boolean = false;
  position: string;
  filtersForm: FormGroup;
  toBeDeletedId: any;
  ewscols: any[];
  examwisesubjects: any[];
  usertypes: any[];
  //pagination and api integration starts from here
  numberOfPages: number = 10;
  totalcount: number = 0;
  noOfItems = 10;
  advancedFilterValue: string = "";
  currentPage: number = 1;
  pageCount: number;
  multiSelectFilterValue: string = "";
  qualArray: Array<multiselectObject> = [];
  expArray: Array<multiselectObject> = [];
  expeArray: Array<multiselectObject> = [];
  classArray: Array<multiselectObject> = [];
  secArray: Array<multiselectObject> = [];
  
  qualMultiFilterValue:string ="";
  expMultiFilterValue:string="";
  expeMultiFilterValue:string="";
  classMultiFilterValue:string="";
  secMultiFilterValue:string="";

  @ViewChild(Table, { static: false }) DataTable: Table;

  constructor(private ExamsService: ExamsService,private dropdownService: DropdownService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.exams = [];
    this.usertypes = [
      { label: 'Admin', value: 'ADMN' },
      { label: 'DataEntryOperator', value: 'DEOP' },
      { label: 'Teacher', value: 'TCHR' },
      { label: 'Parent', value: 'PART' }
    ];
    var dropdowns = ["classes"];
    this.dropdownService.getDropdowns(dropdowns)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          
          this.classes = result.data.classes;
         
        }
      });
  }

  public ngOnInit() {
    this.cols = [
      { field: 'title', header: 'Title' },
      { field: 'year', header: 'Year' },
      { field: 'classes', header: 'Classes' },
      { field: 'createddate', header: 'Created Date' },
      { field: 'createdby', header: 'Created By' },
      { field: 'status', header: 'Status' }
    ];
    this.ewscols = [
      { field: 'subject', header: 'Subject' },
      { field: 'cutoff', header: 'Cut Off' },
      { field: 'total', header: 'Total' }
    ]
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
  onPageChange(event: LazyLoadEvent) {
    let pageObject = Paginationutil.getGridFilters(event, this.advancedFilterValue);

    this.currentPage = pageObject.currentPage;

    let isinitialload = this.pageCount == undefined || this.pageCount == null;
    this.pageCount = pageObject.pageCount;

    let currentrows = event.rows * pageObject.pageNo;

    if (this.totalcount != 0) {
      this.noOfItems = (currentrows < this.totalcount ? currentrows : this.totalcount);
    }

    this.loadGrids(JSON.stringify(pageObject));

  }

  loadGrids(pagingData) {
    let paging = JSON.parse(pagingData);
    //Get Branches API call
    this.ExamsService.getExams(pagingData)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.exams = result.data;
          //pagination starts from here
          this.totalcount = parseInt(result.total);

          if (this.totalcount <= paging.pageSize) {
            this.noOfItems = this.totalcount;
          } else {
            this.noOfItems = (JSON.parse(pagingData)).pageSize;
          }

          if (this.exams != null && this.exams != undefined) {
            this.exams = this.exams.map(function (el, i) {
              var o = Object.assign({}, el);
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
    let id = "0";
    this.router.navigate(['add-exam'], { relativeTo: this.route, queryParams: { type: window.btoa('create'), id: window.btoa(id) } });
  }
  editExam(id): void {
    this.router.navigate(['add-exam'], { relativeTo: this.route, queryParams: { type: window.btoa('edit'), id: window.btoa(id) } });
  }
  viewExam(id): void {
    this.router.navigate(['add-exam'], { relativeTo: this.route, queryParams: { type: window.btoa('view'), id: window.btoa(id) } });
  }
  deleteExam(id): void {
    this.position = "top";
    this.display = true;
    this.toBeDeletedId = id;
  }
  //API Integration ends here
  rowExpand(event, data) {
    this.examwisesubjects=this.exams.filter(item => item.id == event.data.id)[0].subjects;   
  }

  examRevoke(): void {
    this.display = false;
    let customObj = new Exams();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
    //AED Branches API call
    this.ExamsService.AEDExams(customObj)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.successMessage = AppConstants.Messages.successMessage;
        } else {
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
      'tClasses': new FormControl(''),
      'tcreateddate': new FormControl(''),
      'tcreatedby': new FormControl(''),
    });
  }

  
  multiselectSearch(event, from) {
    //creating new object   
    let customObj = new multiselectObject();
    customObj.key = from;
    customObj.value = event.itemValue;

    if (from === "qualification_id") {
      // if object is exists in array then remove object from else push object into array
      var find = false;
      for (let item of this.qualArray) {
        if (item.value === customObj.value && item.key === customObj.key) {
          find = true;
        }
      }
      if (!find) {
        this.qualArray.push(customObj);
      } else {
        this.qualArray = this.qualArray.filter(obj => obj.value !== customObj.value)
      }

      // to create fileter stirng for multiselect
      this.qualMultiFilterValue = this.qualArray.map(object => {
        let comparison = `'${object.value}'`;
        return `(${object.key}=${comparison})`
      }).join(' OR ');

    }
    else if (from === "experience") {
      // if object is exists in array then remove object from else push object into array
      var find = false;
      for (let item of this.expArray) {
        if (item.value === customObj.value && item.key === customObj.key) {
          find = true;
        }
      }
      if (!find) {
        this.expArray.push(customObj);
      } else {
        this.expArray = this.expArray.filter(obj => obj.value !== customObj.value)
      }

      // to create fileter stirng for multiselect
      this.expMultiFilterValue = this.expArray.map(object => {
        let comparison = `'${object.value}'`;
        return `(${object.key}=${comparison})`
      }).join(' OR ');

    }

    else if (from === "subject_id") {
      // if object is exists in array then remove object from else push object into array
      var find = false;
      for (let item of this.expeArray) {
        if (item.value === customObj.value && item.key === customObj.key) {
          find = true;
        }
      }
      if (!find) {
        this.expeArray.push(customObj);
      } else {
        this.expeArray = this.expeArray.filter(obj => obj.value !== customObj.value)
      }

      // to create fileter stirng for multiselect
      this.expeMultiFilterValue = this.expeArray.map(object => {
        let comparison = `'${object.value}'`;
        return `(${object.key}=${comparison})`
      }).join(' OR ');
      
    }

    else if (from === "class_id") {
      // if object is exists in array then remove object from else push object into array
      var find = false;
      for (let item of this.classArray) {
        if (item.value === customObj.value && item.key === customObj.key) {
          find = true;
        }
      }
      if (!find) {
        this.classArray.push(customObj);
      } else {
        this.classArray = this.classArray.filter(obj => obj.value !== customObj.value)
      }

      // to create fileter stirng for multiselect
      this.classMultiFilterValue = this.classArray.map(object => {
        let comparison = `'${object.value}'`;
        return `(${object.key}=${comparison})`
      }).join(' OR ');
      
    }

    else if (from === "section_id") {
      // if object is exists in array then remove object from else push object into array
      var find = false;
      for (let item of this.secArray) {
        if (item.value === customObj.value && item.key === customObj.key) {
          find = true;
        }
      }
      if (!find) {
        this.secArray.push(customObj);
      } else {
        this.secArray = this.secArray.filter(obj => obj.value !== customObj.value)
      }

      // to create fileter stirng for multiselect
      this.secMultiFilterValue = this.secArray.map(object => {
        let comparison = `'${object.value}'`;
        return `(${object.key}=${comparison})`
      }).join(' OR ');
      
    }

    this.multiSelectFilterValue = (this.qualMultiFilterValue == "" ? '(qualification_id > 0 ) AND ' : '('+this.qualMultiFilterValue +') AND ')   + 
                                  (this.expMultiFilterValue == "" ? '(experience > 0 ) AND ' : '('+this.expMultiFilterValue +') AND ')   + 
                                  (this.expeMultiFilterValue == "" ? '(subject_id > 0 ) AND ' : '('+this.expeMultiFilterValue +') AND ')   + 
                                  (this.classMultiFilterValue== "" ? '(class_id > 0 ) AND ' : '('+this.classMultiFilterValue +') AND ')   + 
                                  (this.secMultiFilterValue == "" ? '(section_id > 0 ) ' : '('+this.secMultiFilterValue+')')  
    
    //calling get method with multiselect filters
    let totalFilter = Paginationutil.getGridFilters(this.DataTable, this.multiSelectFilterValue)
    this.loadGrids(JSON.stringify(totalFilter));

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
  getFormat(createddate): string {
    return moment(createddate).format(Paginationutil.getDefaultFormat())
  }
  getFilterFormat(createddate):string{
    return moment(createddate).format(Paginationutil.getFilterDateFormat())
   }
}
