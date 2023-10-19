import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnerPageRoutingModule } from './partner-routing.module';

import { PartnerPage } from './partner.page';
import { PartnerService } from './service/partner.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastConstants } from 'src/app/core/constant/toast.message.constant';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnerPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [PartnerPage],
  providers: [PartnerService, ToastConstants]
})
export class PartnerPageModule { }
