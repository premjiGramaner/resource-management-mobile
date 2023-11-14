import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResourceRequirementPageRoutingModule } from './resource-requirement-routing.module';
import { ResourceRequirementPage } from './resource-requirement.page';
import { AddResourceRequirementComponent } from './add-resource-requirement/add-resource-requirement.component';
import { HttpClientModule } from '@angular/common/http';
import { ResourceCardComponent } from 'src/app/shared/components/resource-card/resource-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceRequirementPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ResourceCardComponent
  ],
  declarations: [ResourceRequirementPage, AddResourceRequirementComponent],
  providers: []
})
export class ResourceRequirementPageModule { }
