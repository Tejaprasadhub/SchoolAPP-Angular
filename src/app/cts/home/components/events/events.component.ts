import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendar } from 'primeng/fullcalendar/primeng-fullcalendar';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
eventsData :any;
eventOptions:any;
position: string;
display:boolean=false;
successMessage:string="";
  constructor(private router: Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.eventsData = [
      {
        "id": 1,
        "title": "All Day Event",
        "start": "2020-02-01"
      },
      {
        "id": 2,
        "title": "Long Event",
        "start": "2020-02-07",
        "end": "2020-02-10"
      },
      {
        "id": 3,
        "title": "Repeating Event",
        "start": "2020-02-09T16:00:00"
      },
      {
        "id": 4,
        "title": "Repeating Event",
        "start": "2020-02-16T16:00:00"
      },
      {
        "id": 5,
        "title": "Conference",
        "start": "2020-02-11",
        "end": "2020-02-13"
      },
      {
        "id": 6,
        "title": "Meeting",
        "start": "2020-02-12T10:30:00",
        "end": "2020-02-12T12:30:00"
      },
      {
        "id": 7,
        "title": "Lunch",
        "start": "2020-02-12T12:00:00"
      },
      {
        "id": 8,
        "title": "Meeting",
        "start": "2020-02-12T14:30:00"
      },
      {
        "id": 9,
        "title": "Happy Hour",
        "start": "2020-02-12T17:30:00"
      },
      {
        "id": 10,
        "title": "Dinner",
        "start": "2020-02-12T20:00:00"
      },
      {
        "id": 11,
        "title": "Birthday Party",
        "start": "2020-02-13T07:00:00"
      },
      {
        "id": 12,
        "title": "Click for Google",
        "url": "http://google.com/",
        "start": "2020-02-28"
      }
    ];
    this.eventOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: '2020-02-01',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,timeGridDay'
      },
      editable: true,
      dateClick: (e) => {
        alert("click event");
      }
    }
  }
  addNew($event:any){
    // this.router.navigateByUrl("Events/add-event?type=create");
    this.router.navigate(['add-event'], {relativeTo: this.route,queryParams: { type: 'create'}});
  }
  editEvent():void{
    // this.router.navigateByUrl("Exams/add-exam?type=edit&id=1");
    this.router.navigate(['add-event'], {relativeTo: this.route,queryParams: { type: 'edit',id:'1'}});
  }
  deleteEvent():void{
    this.position="top";
    this.display=true;
    this.successMessage="";
  }
  eventRevoke():void{
    this.display=false;
    this.successMessage="Event deleted successfully"
  }

}
