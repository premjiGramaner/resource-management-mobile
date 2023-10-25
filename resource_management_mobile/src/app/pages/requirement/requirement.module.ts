import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementPageRoutingModule } from './requirement-routing.module';

import { RequirementPage } from './requirement.page';
import { HttpClientModule } from '@angular/common/http';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';
import { SkillCardComponent } from 'src/app/shared/components/skill-card/skill-card.component';
import { ViewRequirementComponent } from './view-requirement/view-requirement.component';
import { AddRequirementComponent } from './add-requirement/add-requirement.component';
import { PartnerCradComponent } from 'src/app/shared/components/partner-crad/partner-crad.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequirementPageRoutingModule,
    HttpClientModule,
    DeleteNavComponent,
    ReactiveFormsModule,
    SkillCardComponent,
    PartnerCradComponent
  ],
  declarations: [RequirementPage,ViewRequirementComponent,AddRequirementComponent]
})
export class RequirementPageModule {}
