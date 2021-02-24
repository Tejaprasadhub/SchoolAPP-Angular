import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  error:string;
  constructor(private route:ActivatedRoute,private location: Location) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>
      {
        this.error = window.atob(params['message']);
      })
  }
  backtoscreen(): void {
    this.location.back();
  }

}
