import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceListPage } from './resource-list.page';

const routes: Routes = [
  {
    path: '',
    component: ResourceListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceListPageRoutingModule {}
