import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TabView } from 'primeng/tabview';
import { StudentsService } from 'src/app/cts/shared/services/students.service';
import { LazyLoadEvent } from 'primeng/api';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import { SubjectWiseMarks } from 'src/app/cts/shared/models/students';
import { HttpEventType } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.scss']
})
export class StudentprofileComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  basic: any;
  personal: any;
  academic: any[];
  gaurdian: any;
  address: any;
  examwisesubjects:any[];
  selectedIndex = 0;
  //class variable
  @ViewChild(TabView) tabView: TabView;

  //pagination and api integration starts from here
  numberOfPages: number = 10;
  totalcount: number = 0;
  noOfItems = 1;
  advancedFilterValue: string = "";
  currentPage: number = 1;
  pageCount: number;
  totalRecords: number;
  cols: any[];
  studentId:string;

  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private studentsService: StudentsService,private route: ActivatedRoute) {
   
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'classname', header: 'Class Name' },
      { field: 'examtitle', header: 'Exam' },
      { field: 'marks', header: 'Marks' },
      { field: 'status', header: 'Status' }
    ];

    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {     
      this.studentId = window.atob(params['id']);      
    });

     //Get Student Profile Details
     var studentProfileOptions = ["Basic", "Personal","Address","Gaurdian"];
     this.studentsService.GetStudentProfile(studentProfileOptions,this.studentId)
       .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
         if (result.success) {
           this.basic = result.data.Basic[0];
           this.personal = result.data.Personal[0];
           this.address = result.data.Address[0];
           this.gaurdian = result.data.Gaurdian[0];
         }
       });
  }

  tabChange($event) {
    this.selectedIndex = $event.index;
    this.GetPanelDetails(this.tabView.tabs[this.selectedIndex].header);
    // this.GetPanelDetails("Academic");
  }

  GetPanelDetails(tabPanel) {
    //Get Dropdowns API call  
    var tabPanels = [];
    tabPanels.push(tabPanel)
    this.studentsService.GetStudentProfile(tabPanels,this.studentId)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          if (tabPanel == "Academic") {
            this.academic = result.data.Academic;
          }
          else if (tabPanel == "Address") {
            this.address = result.data.Address[0];
          }
          else if (tabPanel == "Gaurdian") {
            this.gaurdian = result.data.Gaurdian[0];
          }
        }
      });
  }

  //API Integration ends here
  rowExpand(event, data) {

    let customObj = new SubjectWiseMarks();
    customObj.id = event.data.id;
    customObj.classid = event.data.classid;
    customObj.examid = event.data.examid;
    
    this.studentsService.GetExamWiseSubjectMarks(customObj)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result.success) {
          this.examwisesubjects = result.data;
        }
      });

  }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.studentsService.StudentProfilePicUpload(formData)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
        }
      }
    );



    // this.http.post('https://localhost:5001/api/upload', formData, {reportProgress: true, observe: 'events'})
    //   .subscribe(event => {
    //     if (event.type === HttpEventType.UploadProgress)
    //       this.progress = Math.round(100 * event.loaded / event.total);
    //     else if (event.type === HttpEventType.Response) {
    //       this.message = 'Upload success.';
    //       this.onUploadFinished.emit(event.body);
    //     }
    //   });
  }



}
