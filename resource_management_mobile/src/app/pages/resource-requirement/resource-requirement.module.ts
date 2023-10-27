import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourceRequirementPageRoutingModule } from './resource-requirement-routing.module';

import { ResourceRequirementPage } from './resource-requirement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceRequirementPageRoutingModule
  ],
  declarations: [ResourceRequirementPage]
})
export class ResourceRequirementPageModule {}
