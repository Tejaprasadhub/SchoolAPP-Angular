

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';


const appRoutes:Routes=[
{
  path:'home',redirectTo:'',pathMatch:'full'
},
{ 
  path: 'sharedrouting', loadChildren: () => import('./cts/shared/sharedrouting/sharedrouting.module').then(m => m.SharedroutingModule) 
},
{
  path:'**', component:PagenotfoundComponent
}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
