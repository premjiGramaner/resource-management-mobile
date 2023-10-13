import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourceHiringPageRoutingModule } from './resource-hiring-routing.module';

import { ResourceHiringPage } from './resource-hiring.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceHiringPageRoutingModule
  ],
  declarations: [ResourceHiringPage]
})
export class ResourceHiringPageModule {}
