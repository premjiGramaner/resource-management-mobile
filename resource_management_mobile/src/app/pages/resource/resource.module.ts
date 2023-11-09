import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourcePageRoutingModule } from './resource-routing.module';

import { ResourcePage } from './resource.page';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ViewResourceComponent } from './view-resource/view-resource.component';
import { SkillCardComponent } from 'src/app/shared/components/skill-card/skill-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourcePageRoutingModule,
    ReactiveFormsModule,
    SkillCardComponent
  ],
  declarations: [ResourcePage,AddResourceComponent, ViewResourceComponent]
})
export class ResourcePageModule {}
