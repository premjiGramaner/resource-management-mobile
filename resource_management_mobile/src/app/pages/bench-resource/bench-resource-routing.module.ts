import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BenchResourcePage } from './bench-resource.page';

const routes: Routes = [
  {
    path: '',
    component: BenchResourcePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BenchResourcePageRoutingModule {}
