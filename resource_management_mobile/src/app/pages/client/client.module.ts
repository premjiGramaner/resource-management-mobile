import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientPageRoutingModule } from './client-routing.module';

import { ClientPage } from './client.page';
import { ClientService } from './service/client.service';
import { HttpClientModule } from '@angular/common/http';
import { AddClientComponent } from './add-client/add-client.component';
import { ViewClientComponent } from './view-client/view-client.component';
import { DuplicateRemoverPipe } from 'src/app/shared/helpers/pipes/duplicate-remover.pipe';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { SkillCardComponent } from 'src/app/shared/components/skill-card/skill-card.component';
import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ViewClientComponent,
    DuplicateRemoverPipe,
    SkillCardComponent,
    SearchableDropdownComponent
  ],
  declarations: [ClientPage, AddClientComponent],
  providers: [ClientService, DuplicateRemoverPipe, ToastConstants],
})
export class ClientPageModule { }
