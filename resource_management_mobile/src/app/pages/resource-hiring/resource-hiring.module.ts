import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResourceHiringPageRoutingModule } from './resource-hiring-routing.module';
import { ResourceHiringPage } from './resource-hiring.page';
import { ViewHiringComponent } from './view-hiring/view-hiring.component';
import { AddHiringComponent } from './add-hiring/add-hiring.component';
import { HiringChangeCardComponent } from 'src/app/shared/components/hiring-change-card/hiring-change-card.component';
import { DateformatConverterPipe } from 'src/app/shared/helpers/pipes/dateformat-converter.pipe';
import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceHiringPageRoutingModule,
    ReactiveFormsModule,
    HiringChangeCardComponent,
    SearchableDropdownComponent
  ],
  exports: [ViewHiringComponent],
  declarations: [ResourceHiringPage, AddHiringComponent, ViewHiringComponent],
  providers: [DatePipe, DateformatConverterPipe]

})
export class ResourceHiringPageModule { }
