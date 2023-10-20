import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PartnerPageRoutingModule } from './partner-routing.module';
import { PartnerPage } from './partner.page';
import { PartnerService } from './service/partner.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';
import { ViewPartnerComponent } from './view-partner/view-partner.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { DuplicateRemoverPipe } from 'src/app/shared/helpers/pipes/duplicate-remover.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnerPageRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [PartnerPage, ViewPartnerComponent, AddPartnerComponent],
  providers: [PartnerService, ToastConstants, DuplicateRemoverPipe]
})
export class PartnerPageModule { }
