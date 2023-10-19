import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnerPageRoutingModule } from './partner-routing.module';

import { PartnerPage } from './partner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnerPageRoutingModule
  ],
  declarations: [PartnerPage]
})
export class PartnerPageModule {}
