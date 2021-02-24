import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedroutingRoutingModule } from './sharedrouting-routing.module';
import { SharedroutingComponent } from './sharedrouting.component';



// primeng module div section
//Teja Prasad Section Starts
import {MegaMenuModule} from 'primeng/megamenu';
import {ChartModule} from 'primeng/chart';
import {FullCalendarModule} from 'primeng/fullcalendar';
import {CarouselModule} from 'primeng/carousel';

//Teja Prasad Section Ends
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {TabViewModule} from 'primeng/tabview';
//Sindhu Section Starts

//Sindhu Section Ends
import {AccordionModule} from 'primeng/accordion';
import {MultiSelectModule} from 'primeng/multiselect';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PasswordModule} from 'primeng/password'
import {DialogModule} from 'primeng/dialog';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';
import { AUTHZ_SERVICE } from 'src/app/core/security/authorization.service';
import { AuthorizationService } from '../services/authorization.service';
//Chaitanya Section Starts

//Chaitanya Section Ends


@NgModule({
  declarations: [SharedroutingComponent],
  imports: [
    CommonModule,
    SharedroutingRoutingModule,
    InputTextModule,
    MegaMenuModule,
    ChartModule,
    FullCalendarModule,
    CarouselModule,
    CardModule,
    ButtonModule,
    TableModule,
    MultiSelectModule, DropdownModule,
    CalendarModule,
    TabViewModule,
    AccordionModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    PasswordModule,
    DialogModule,
  ],
  exports:[
    InputTextModule,
    MegaMenuModule,
    ChartModule,
    FullCalendarModule,
    CarouselModule,
    CardModule,
    ButtonModule,
    TableModule,
    MultiSelectModule, DropdownModule,
    CalendarModule,
    TabViewModule,
    AccordionModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    PasswordModule,
    DialogModule
  ],
  providers:[
    AuthorizationGuard,
    {provide:AUTHZ_SERVICE,useClass:AuthorizationService}
  ]
})
export class SharedroutingModule { }
