import { BrowserModule } from '@angular/platform-browser';
import { NgModule  } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule } from '@angular/common';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { HomeRoutingModule } from './home-routing.module';
import { SharedroutingModule } from '../../shared/sharedrouting/sharedrouting.module';


import { TopbarComponent } from '../../home/components/topbar/topbar.component';
import { MenubarComponent } from '../../home/components/menubar/menubar.component';
import { TilesComponent } from '../../home/components/tiles/tiles.component';
import { StudentsComponent } from '../../home/components/students/students.component';
import { TeachersComponent } from '../../home/components/teachers/teachers.component';

import { UsersComponent } from '../../home/components/users/users.component';
import { ExamsComponent } from '../../home/components/exams/exams.component';
import { ClassesComponent } from '../../home/components/classes/classes.component';



import { StudentlayoutComponent } from '../../home/components/students/studentlayout/studentlayout.component';
import { StudentprofileComponent } from '../../home/components/students/studentprofile/studentprofile.component';
import { StudenteditComponent } from '../../home/components/students/studentedit/studentedit.component';
import { StudentreportsComponent } from '../../home/components/students/studentreports/studentreports.component';
import { StudentmarksComponent } from '../../home/components/students/studentmarks/studentmarks.component';
import { StudentmoreComponent } from '../../home/components/students/studentmore/studentmore.component';
import { AddTeacherComponent } from '../../home/components/teachers/add-teacher/add-teacher.component';
import { AddUserComponent } from '../../home/components/users/add-user/add-user.component';
import { ChangePasswordComponent } from '../../home/components/change-password/change-password.component';
import { SectionsComponent } from '../../home/components/sections/sections.component';
import { DashboardComponent } from '../../home/components/dashboard/dashboard.component';
import { MyProfileComponent } from '../../home/components/my-profile/my-profile.component';
import { RoleAccessComponent } from '../../home/components/role-access/role-access.component';
import { SettingsComponent } from '../../home/components/settings/settings.component';
import { AboutUsComponent } from '../../home/components/about-us/about-us.component';
import { StatisticsComponent } from '../../home/components/statistics/statistics.component';
import { AddStudentComponent } from '../../home/components/students/add-student/add-student.component';
import { AddSectionComponent } from '../../home/components/sections/add-section/add-section.component';
import { AddExamComponent } from '../../home/components/exams/add-exam/add-exam.component';
import { AddClassComponent } from '../../home/components/classes/add-class/add-class.component';
import { FooterComponent } from '../../home/components/footer/footer.component';
import { EventsComponent } from '../../home/components/events/events.component';
import { FeesComponent } from '../../home/components/fees/fees.component';
import { NewsComponent } from '../../home/components/news/news.component';
import { AchievementsComponent } from '../../home/components/achievements/achievements.component';
import { AddAchievementComponent } from '../../home/components/achievements/add-achievement/add-achievement.component';
import { AddEventComponent } from '../../home/components/events/add-event/add-event.component';
import { AddFeeComponent } from '../../home/components/fees/add-fee/add-fee.component';
import { AddNewsComponent } from '../../home/components/news/add-news/add-news.component';
import { LayoutComponent } from '../components/layout/layout.component';
import { ErrorComponent } from '../components/error/error.component';




@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    MenubarComponent,
    TilesComponent,
    StudentsComponent,
    TeachersComponent,
    UsersComponent,
    ExamsComponent,
    ClassesComponent,
    StudentlayoutComponent,
    StudentprofileComponent,
    StudenteditComponent,
    StudentreportsComponent,
    StudentmarksComponent,
    StudentmoreComponent,
    AddTeacherComponent,
    AddUserComponent,
    ChangePasswordComponent,
    SectionsComponent,
    DashboardComponent,
    MyProfileComponent,
    RoleAccessComponent,
    SettingsComponent,
    AboutUsComponent,
    StatisticsComponent,
    AddStudentComponent,
    AddSectionComponent,
    AddExamComponent,
    AddClassComponent,
    FooterComponent,
    EventsComponent,
    FeesComponent,
    NewsComponent,
    AchievementsComponent,
    AddAchievementComponent,
    AddEventComponent,
    AddFeeComponent,
    AddNewsComponent,
    ErrorComponent
    
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  
    HomeRoutingModule,    
    BrowserModule,
    AppRoutingModule,
    SharedroutingModule,    
  ],
  exports:[
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    
    LayoutComponent,
    TopbarComponent,
    MenubarComponent,
    TilesComponent
  ],
  providers: []
})

export class HomeModule { }
