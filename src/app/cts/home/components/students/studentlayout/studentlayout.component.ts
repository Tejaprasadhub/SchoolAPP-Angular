import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-studentlayout',
  templateUrl: './studentlayout.component.html',
  styleUrls: ['./studentlayout.component.scss']
})
export class StudentlayoutComponent implements OnInit {
  urlPath : string;
  private ngUnsubscribe = new Subject();
  studentID:string;
  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.urlPath='student-profile';
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {     
      this.studentID = window.atob(params['id']);      
    });    
  }

  routing(studentInfoURL){
    this.urlPath = (studentInfoURL.split(':')[1]).slice(0,-1);
     this.router.navigate([{ outlets: { detail: [this.urlPath] } }], {relativeTo: this.route,
      queryParams: { 
        id: window.btoa(this.studentID) }});   
  }
}
