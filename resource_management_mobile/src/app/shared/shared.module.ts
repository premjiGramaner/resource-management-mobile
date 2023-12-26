import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedPageRoutingModule } from './shared-routing.module';
import { SharedPage } from './shared.page';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DateformatConverterPipe } from './helpers/pipes/dateformat-converter.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedPageRoutingModule],
  exports: [HeaderComponent],
  declarations: [SharedPage, HeaderComponent, DateformatConverterPipe],
  providers: [DatePipe],
})
export class SharedPageModule { }
