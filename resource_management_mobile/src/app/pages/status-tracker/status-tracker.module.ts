import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusTrackerPageRoutingModule } from './status-tracker-routing.module';

import { StatusTrackerPage } from './status-tracker.page';
import { HiringStatusComponent } from './components/hiring-status/hiring-status.component';
import { RequirementStatusComponent } from './components/requirement-status/requirement-status.component';
import { HiringChangeCardComponent } from 'src/app/shared/components/hiring-change-card/hiring-change-card.component';
import { ResourceHiringPageModule } from '../resource-hiring/resource-hiring.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusTrackerPageRoutingModule,
    HiringChangeCardComponent,
    ResourceHiringPageModule
  ],
  declarations: [StatusTrackerPage, HiringStatusComponent, RequirementStatusComponent]
})
export class StatusTrackerPageModule {}
