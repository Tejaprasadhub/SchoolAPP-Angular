import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendar } from 'primeng/fullcalendar/primeng-fullcalendar';
import { Paginationutil } from 'src/app/cts/shared/models/paginationutil';
import * as moment from 'moment';
import { Events } from 'src/app/cts/shared/models/achievements';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { AchievementsService } from 'src/app/cts/shared/services/achievements.service';
import { AppConstants } from 'src/app/cts/app-constants';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: any[]=[];
  options: any;
  position: string;
  display: boolean = false;
  toBeDeletedId:any;
  errorMessage: string = "";
  successMessage: string = "";
  private ngUnsubscribe = new Subject();

  calendar: any;

  nextListener: any;

  prevListener: any;

  date: Date = new Date();
  @ViewChild('fullCalendar') fullCalendar: any;
  constructor(private achievementService: AchievementsService,private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEvents("Current");    
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      header: {
        left: 'prev',
        center: '',
        // right: 'dayGridMonth,dayGridWeek,timeGridDay'
        right: 'next'
      },
      customButtons: {
        prev: {
          text: "Prev",
          click: r => {
            this.getEvents("Prev");
            //this works but displayAddAppointment within the component is inaccessible.
            //I would like to display a modal dialog to add a new appointment from this.
          }
        },
        next: {
          text: "Next",
          click: r => {
            this.getEvents("Next");
            //this works but displayAddAppointment within the component is inaccessible.
            //I would like to display a modal dialog to add a new appointment from this.
          }
        }
      },
      editable: true,
      dateClick: (e) => {
        alert("click event");
      }
    }
  }

  getMonthFormat(date): string {
    return moment(date).format(Paginationutil.getAngularMonthFormat())
  }
  getServerSideDateFormat(date): string {
    return moment(date).format(Paginationutil.getServerSideDateFormat())
  }

  getDateFormat(date): string {
    return moment(date).format(Paginationutil.getAngularDateFormat())
  }


  getEvents(from: string) {
    if (from === "Prev") {
      this.date = new Date(this.date);
      this.date.setMonth(this.date.getMonth() - 1);
    } else if (from === "Next") {
      var nextMonth = new Date(this.date);
      this.date.setMonth(this.date.getMonth() + 1);
    }else{
      this.date = new Date(this.date);
      this.date.setMonth(this.date.getMonth());
    }

    var firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

    let customObj = new Events();
    customObj.id = 0;
    customObj.querytype = 1;
    customObj.start = this.getServerSideDateFormat(firstDay);
    customObj.end = this.getServerSideDateFormat(lastDay);

    this.achievementService.getEvents(customObj)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.success) {          
          this.events=result.data;
      }
    });
  }
  

    //Crud events
    addEvent($event: any) {
      let id = "0";
      this.router.navigate(['add-event'], { relativeTo: this.route, queryParams: { type: window.btoa('create'), id: window.btoa(id) } });
    }
    editEvent(id): void {
      this.router.navigate(['add-event'], { relativeTo: this.route, queryParams: { type: window.btoa('edit'), id: window.btoa(id) } });
    }
    viewEvent(id): void {
      this.router.navigate(['add-event'], { relativeTo: this.route, queryParams: { type: window.btoa('view'), id: window.btoa(id) } });
    }
  deleteEvent(id): void {
    this.position = "top";
    this.display = true;
    this.successMessage = "";
    this.toBeDeletedId = id;
  }

  eventRevoke(): void {
    this.display=false;
    let customObj = new Events();
    customObj.id = this.toBeDeletedId;
    customObj.querytype = 3;
     //AED Branches API call
     this.achievementService.AEDEvents(customObj)
     .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
       if (result.success) {       
         this.successMessage = AppConstants.Messages.successMessage;
         this.getEvents("current");
       }else{
         this.errorMessage = AppConstants.Messages.errorMessage;
       }
     }); 
  }


}
