import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusTrackerPage } from './status-tracker.page';

const routes: Routes = [
  {
    path: '',
    component: StatusTrackerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusTrackerPageRoutingModule {}
