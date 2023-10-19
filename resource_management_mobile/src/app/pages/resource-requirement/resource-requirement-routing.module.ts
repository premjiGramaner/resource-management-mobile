import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceRequirementPage } from './resource-requirement.page';

const routes: Routes = [
  {
    path: '',
    component: ResourceRequirementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRequirementPageRoutingModule {}
