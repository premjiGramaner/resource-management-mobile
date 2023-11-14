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
import { ViewRequirementStatusComponent } from './components/requirement-status/view-requirement-status/view-requirement-status.component';
import { RequirementChangeStatusComponent } from 'src/app/shared/components/requirement-change-status/requirement-change-status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusTrackerPageRoutingModule,
    HiringChangeCardComponent,
    RequirementChangeStatusComponent,
    ResourceHiringPageModule
  ],
  declarations: [StatusTrackerPage, HiringStatusComponent, RequirementStatusComponent, ViewRequirementStatusComponent]
})
export class StatusTrackerPageModule {}
