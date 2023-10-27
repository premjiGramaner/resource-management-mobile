import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceHiringPage } from './resource-hiring.page';

const routes: Routes = [
  {
    path: '',
    component: ResourceHiringPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceHiringPageRoutingModule {}
