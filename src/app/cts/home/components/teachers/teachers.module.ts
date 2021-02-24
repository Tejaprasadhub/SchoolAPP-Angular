
//common import for every child/feature module
import { NgModule  } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { TeachersRoutingModule } from './teachers-routing.module';


import { TeachersComponent } from './teachers.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { SharedroutingModule } from 'src/app/cts/shared/sharedrouting/sharedrouting.module';
import { AddTeacherClassSectionComponent } from './add-teacher-class-section/add-teacher-class-section.component';


@NgModule({
  declarations: [TeachersComponent,AddTeacherComponent, AddTeacherClassSectionComponent],
  imports: [
    //common import for every child/feature module
    FormsModule,    
    ReactiveFormsModule,  

    
    TeachersRoutingModule,
    SharedroutingModule
  ]
})
export class TeachersModule { }
