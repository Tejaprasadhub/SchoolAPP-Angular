import { Component, OnInit } from '@angular/core';
import { debug } from 'console';
import { MenuItem } from 'primeng/api/menuitem';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { DropdownService } from 'src/app/cts/shared/services/dropdown.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  menuItems: any[]=[];

  featuresArray:any[]=[];

  schoolOptions:any[]=[];
  teacherOptions:any[]=[];
  studentOptions:any[]=[];
  additionalOptions:any[]=[];
  constructor(private dropdownService: DropdownService) {    

   }

  ngOnInit(): void {
    this.dropdownService.getMenuOptions()
    .pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result.success) {      
        this.featuresArray = result.data;    
        this.schoolOptions = this.featuresArray.filter(obj => obj.category_code == 'SCHL');
        this.teacherOptions = this.featuresArray.filter(obj => obj.category_code == 'TCHR');
        this.studentOptions = this.featuresArray.filter(obj => obj.category_code == 'STDT');
        this.additionalOptions = this.featuresArray.filter(obj => obj.category_code == 'ADDL'); 

        this.menuItems = [
          {
            "label": "School",
            "url": null,
            "items": 
            [
              [
                {
                  "label": "School",
                  "items": this.schoolOptions
                }
              ]
            ]
          }
          ,{
            "label": "Teachers",
            "url": null,
            "items": 
            [
              [
                {
                  "label": "Teachers",
                  "items": this.teacherOptions
                }
              ]
            ]
          },{
            "label": "Students",
            "url": null,
            "items": 
            [
              [
                {
                  "label": "Students",
                  "items": this.studentOptions
                }
              ]
            ]
          },{
            "label": "Additional",
            "url": null,
            "items": 
            [
              [
                {
                  "label": "Additional",
                  "items": this.additionalOptions
                }
              ]
            ]
          },{
            "label": "About Us",
            "url": "admin/aboutUs"
          }
          
        ]
      }
    });   
  }
}
