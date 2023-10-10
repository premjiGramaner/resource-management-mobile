import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResourceListPageRoutingModule } from './resource-list-routing.module';

import { ResourceListPage } from './resource-list.page';
import { SharedPageModule } from 'src/app/shared/shared.module';
import { DeleteNavComponent } from 'src/app/shared/components/delete-nav/delete-nav.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResourceListPageRoutingModule,
    SharedPageModule
  ],
  declarations: [ResourceListPage,DeleteNavComponent]
})
export class ResourceListPageModule {}
