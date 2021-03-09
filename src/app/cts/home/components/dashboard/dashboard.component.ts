import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendar } from 'primeng/fullcalendar/primeng-fullcalendar';
import { DashboardService } from 'src/app/cts/shared/services/dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  ourStudentsData: any;
  ourExpenditureData: any;
  ourIncomedata: any;
  ourOverviewData: any;
  eventsData: any;
  eventOptions: any;
  announcementData: any;
  ourachivementsData: any[];
  responsiveOptions;
  teacherPerformancedata:any;
  ourTopStudents:any;
  academicPerformance: any;

  constructor(private dashboardservice:DashboardService) { }

  ngOnInit(): void {
    this.GetSudentsbyGender();
    this.GetAcademicPerformance();
    this.GetAcievements();
    this.GetTeacherPerformance();
    
    
    this.ourExpenditureData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: '2019',
          backgroundColor: '#448fab',
          borderColor: '#448fab',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: '2020',
          backgroundColor: '#008000',
          borderColor: '#008000',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    }
    this.ourOverviewData = {
      labels: ['Students', 'Teachers', 'Users'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "#448fab",
            "#008000",
            "#d69d33"
          ],
          hoverBackgroundColor: [
            "#448fab",
            "#008000",
            "#d69d33"
          ]
        }]
    };
    this.ourIncomedata = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: '2019',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#448fab'
        },
        {
          label: '2020',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#008000'
        }
      ]
    }

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

    this.announcementData = [
      {
        "date": "14th June,2020",
        "description": "Sample announcement1",
        "createyBy": "Teja Prasad",
        "timelapse": "5 mins ago"
      },
      {
        "date": "15th July,2020",
        "description": "Sample announcement2",
        "createyBy": "Teja Prasad",
        "timelapse": "10 mins ago"
      },
      {
        "date": "15th July,2020",
        "description": "Sample announcement3",
        "createyBy": "Teja Prasad",
        "timelapse": "15 mins ago"
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

    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.ourTopStudents=[
      {
        "name":"Teja Prasad",
        "class":"6",
        "percentage":"90%"
      },
      {
        "name":"Chaitanya",
        "class":"7",
        "percentage":"100%"
      },
      {
        "name":"Sindhuja",
        "class":"8",
        "percentage":"99%"
      },
      {
        "name":"Ganesh",
        "class":"4",
        "percentage":"95%"
      },
      {
        "name":"Kiran",
        "class":"7",
        "percentage":"92%"
      },
      {
        "name":"Rahul",
        "class":"8",
        "percentage":"79%"
      },
      {
        "name":"Ramesh",
        "class":"9",
        "percentage":"89%"
      }
    ]
  }

  GetSudentsbyGender()
  {
    var params=JSON.stringify(this.getReqData("GetStudentsbyGender"));
    this.dashboardservice.getDashBoard(params)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
        var gendercount=[];
        let Gender=["M","F"];
        Gender.forEach(ele=>{
            let val=result.data.ctcstudents.find(x=>x.ctcstudent_gender==ele).count;
            gendercount.push(val);
        });
        this.ourStudentsData = {
          labels: ["Male","Female"],
          datasets: [
            {
              data: gendercount,
              backgroundColor: [
                "#448fab",
                "#008000"
              ],
              hoverBackgroundColor: [
                "#448fab",
                "#008000"
              ]
            }]
        };
      }  
    });
  }

  GetAcademicPerformance()
  {
    var params=JSON.stringify(this.getReqData("GetAcademicPerformance"));
    this.dashboardservice.getDashBoard(params)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
        var subjects=[];
        var MaledataSet=[];
        var FemaledataSet=[];
        result.data.subjects.forEach(element => {
          subjects.push(element.subjectName);
        });
        subjects.forEach(ele=>{
          let MaleResult=result.data.table1.find(x=>x.subjectName==ele && x.gender=='M');
          let FemaleResult=result.data.table1.find(x=>x.subjectName==ele && x.gender=='F');
          MaledataSet.push(MaleResult==undefined?"0":MaleResult.marks);
          FemaledataSet.push(FemaleResult==undefined?"0":FemaleResult.marks);
      });
      this.academicPerformance={
        labels: subjects,
        datasets: [
            {
                label: 'Boys',
                backgroundColor: 'rgb(153, 255, 187,0.2)',
                borderColor: 'rgb(0, 153, 51)',
                pointBackgroundColor: 'rgb(153, 255, 187,1)',
                pointBorderColor: '#009933',
                pointHoverBackgroundColor: '#009933',
                pointHoverBorderColor: 'rgb(153, 255, 187,1)',
                data: MaledataSet
            },
            {
                label: 'Girls',
                backgroundColor: 'rgb(179, 204, 255,0.2)',
                borderColor: 'rgb(0, 122, 204)',
                pointBackgroundColor: 'rgb(179, 204, 255,1)',
                pointBorderColor: '#6699ff',
                pointHoverBackgroundColor: '#6699ff',
                pointHoverBorderColor: 'rgb(179, 204, 255,1)',
                data: FemaledataSet
            }
        ]
    };
      }  
    });
    
  }

  GetAcievements()
  {
    var params=JSON.stringify(this.getReqData("GetAcievements"));
    this.dashboardservice.getDashBoard(params)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
        this.ourachivementsData = result.data.achievements;
       
      }  
    });
  }

  GetTeacherPerformance()
  {
    var params=JSON.stringify(this.getReqData("GetTeacherPerformance"));
    this.dashboardservice.getDashBoard(params)
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{  
      if(result.success){
        
      }  
    });
    
    this.teacherPerformancedata = {
      datasets: [{
        data: [
          88,67,76,
          72,61,56,
          91,58,86,
        ],
        backgroundColor: [
          "#448fab","#008000","#448fab",
          "#008000","#448fab","#008000",
          "#448fab","#008000","#448fab",
        ],
        label: 'My dataset'
      }],
      labels: [
        "Teacher1","teacher2","Teacher3",
        "Teacher4","teacher5","Teacher6",
        "Teacher7","teacher8","Teacher9",
      ],
      legend: {display: false}
    }
  }

  getReqData(chartType)
  {
    return {
      "start": "",
      "end": "",
      "chartType": chartType
  };
  }


}
