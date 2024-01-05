import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BenchResourcePageRoutingModule } from './bench-resource-routing.module';

import { BenchResourcePage } from './bench-resource.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenchResourcePageRoutingModule
  ],
  declarations: [BenchResourcePage]
})
export class BenchResourcePageModule {}
