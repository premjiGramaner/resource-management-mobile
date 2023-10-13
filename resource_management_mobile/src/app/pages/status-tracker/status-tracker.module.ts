import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusTrackerPageRoutingModule } from './status-tracker-routing.module';

import { StatusTrackerPage } from './status-tracker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusTrackerPageRoutingModule
  ],
  declarations: [StatusTrackerPage]
})
export class StatusTrackerPageModule {}
