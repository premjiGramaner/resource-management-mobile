import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientPage } from './client.page';
import { AddClientComponent } from './add-client/add-client.component';

const routes: Routes = [
  {
    path: '',
    component: ClientPage
  }, {
    path: 'add/client',
    component: AddClientComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientPageRoutingModule { }
