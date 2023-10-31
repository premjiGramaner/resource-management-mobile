import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SkillPageRoutingModule } from './skill-routing.module';

import { SkillPage } from './skill.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkillPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SkillPage]
})
export class SkillPageModule { }
