import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientPageRoutingModule } from './client-routing.module';

import { ClientPage } from './client.page';
import { ClientService } from './service/client.service';
import { HttpClientModule } from '@angular/common/http';
import { AddClientComponent } from './add-client/add-client.component';
import { ViewClientComponent } from './view-client/view-client.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ViewClientComponent
  ],
  declarations: [ClientPage, AddClientComponent],
  providers: [ClientService],
})
export class ClientPageModule { }
