import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementPageRoutingModule } from './requirement-routing.module';

import { RequirementPage } from './requirement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequirementPageRoutingModule
  ],
  declarations: [RequirementPage]
})
export class RequirementPageModule {}
