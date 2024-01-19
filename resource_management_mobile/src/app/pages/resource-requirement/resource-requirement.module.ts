import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResourceRequirementPageRoutingModule } from './resource-requirement-routing.module';
import { ResourceRequirementPage } from './resource-requirement.page';
import { AddResourceRequirementComponent } from './add-resource-requirement/add-resource-requirement.component';
import { HttpClientModule } from '@angular/common/http';
import { ResourceCardComponent } from 'src/app/shared/components/resource-card/resource-card.component';
import { DateformatConverterPipe } from 'src/app/shared/helpers/pipes/dateformat-converter.pipe';
import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceRequirementPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ResourceCardComponent,
    SearchableDropdownComponent
  ],
  declarations: [ResourceRequirementPage, AddResourceRequirementComponent],
  providers: [DatePipe, DateformatConverterPipe],
  exports: [AddResourceRequirementComponent]
})
export class ResourceRequirementPageModule { }
