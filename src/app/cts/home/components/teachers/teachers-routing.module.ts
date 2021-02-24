import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { TeachersComponent } from './teachers.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { AuthenticationGuardService } from 'src/app/core/security/authentication-guard.service';
import { AuthorizationGuard } from 'src/app/core/security/authorization-guard';


const teacherroutes: Routes = [
  { path: '', component: TeachersComponent, canActivate:[AuthenticationGuardService,AuthorizationGuard] },
  { path: 'add-teacher', component: AddTeacherComponent, canActivate:[AuthenticationGuardService,,AuthorizationGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(teacherroutes)],
  exports:[
    RouterModule
  ]
  
})
export class TeachersRoutingModule { }
