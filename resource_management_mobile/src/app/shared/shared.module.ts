import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedPageRoutingModule } from './shared-routing.module';

import { SharedPage } from './shared.page';
import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component';
import { DeleteNavComponent } from './components/delete-nav/delete-nav.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedPageRoutingModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent
  ],
  declarations: [SharedPage, FooterComponent, HeaderComponent]
})
export class SharedPageModule {}
