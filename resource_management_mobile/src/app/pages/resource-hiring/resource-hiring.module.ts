import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourceHiringPageRoutingModule } from './resource-hiring-routing.module';

import { ResourceHiringPage } from './resource-hiring.page';
import { ViewHiringComponent } from './view-hiring/view-hiring.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceHiringPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ResourceHiringPage, ViewHiringComponent]
})
export class ResourceHiringPageModule {}
