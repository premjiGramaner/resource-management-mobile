import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementPageRoutingModule } from './requirement-routing.module';

import { RequirementPage } from './requirement.page';
import { SkillCardComponent } from 'src/app/shared/components/skill-card/skill-card.component';
import { ViewRequirementComponent } from './view-requirement/view-requirement.component';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { PartnerCradComponent } from 'src/app/shared/components/partner-crad/partner-crad.component';
import { DateformatConverterPipe } from 'src/app/shared/helpers/pipes/dateformat-converter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequirementPageRoutingModule,
    ReactiveFormsModule,
    SkillCardComponent,
    PartnerCradComponent
  ],
  declarations: [RequirementPage,ViewRequirementComponent,AddRequirementComponent],
  providers:[DatePipe, DateformatConverterPipe]
})
export class RequirementPageModule {}
