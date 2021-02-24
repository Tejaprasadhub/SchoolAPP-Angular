import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedroutingComponent } from './sharedrouting.component';

const routes: Routes = [{ path: '', component: SharedroutingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedroutingRoutingModule { }
